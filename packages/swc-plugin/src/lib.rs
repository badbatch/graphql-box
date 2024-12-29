use regex::Regex;
use std::env;
use std::fs::{read_to_string, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use swc_core::common::DUMMY_SP;
use swc_core::ecma::{
    ast::{Expr, ImportSpecifier, Lit, Module, ModuleDecl, Program, Str, TaggedTpl, VarDeclarator},
    transforms::testing::test_inline,
    visit::{as_folder, noop_visit_mut_type, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor;

const IMPORT_GQL_IDENT: &str = "importGql";
const WHITELIST_FILE: &str = ".gql-query-whitelist";

fn get_import_gql_index(module_node: &mut Module) -> Option<usize> {
    let mut index = None;

    for (i, module_item) in module_node.body.iter().enumerate() {
        index = module_item.clone().module_decl().and_then(|module_decl| {
            if let ModuleDecl::Import(import_decl) = module_decl {
                for specifier in import_decl.specifiers.iter() {
                    if let ImportSpecifier::Default(import_default) = specifier {
                        if import_default.local.sym.as_str() == IMPORT_GQL_IDENT {
                            return Some(i);
                        }
                    }
                }
            }

            None
        });

        if index.is_some() {
            break;
        }
    }

    index
}

fn unbox<T>(value: Box<T>) -> T {
    *value
}

fn get_expr(node: &mut VarDeclarator) -> Option<Expr> {
    node.init.take().map(unbox)
}

fn get_current_dir() -> Option<String> {
    env::current_dir().ok()?.to_str().map(String::from)
}

fn get_tagged_tpl(node: &mut VarDeclarator) -> Option<TaggedTpl> {
    get_expr(node)
        .and_then(|expr| match expr {
            Expr::TaggedTpl(tagged_tpl) => Some(tagged_tpl),
            _ => None,
        })
        .and_then(|tagged_tpl| {
            tagged_tpl
                .tag
                .clone()
                .ident()
                .filter(|ident| ident.sym.as_str() == IMPORT_GQL_IDENT)
                .map(|_| tagged_tpl)
        })
}

fn is_ident_import_gql(tagged_tpl: Option<TaggedTpl>) -> bool {
    tagged_tpl.is_some()
}

fn get_gql_query(tagged_tpl: Option<TaggedTpl>) -> Option<String> {
    tagged_tpl
        .and_then(|tagged_tpl| {
            if let Some(tpl_element) = tagged_tpl.tpl.quasis.get(0) {
                let tpl_element = tpl_element.clone();
                Some(tpl_element)
            } else {
                None
            }
        })
        .and_then(|tpl_element| get_current_dir().map(|current_dir| (tpl_element, current_dir)))
        .and_then(|(tpl_element, current_dir)| {
            let path = Path::new(&current_dir).join(tpl_element.raw.as_str());
            read_to_string(&path).ok()
        })
}

fn get_whitespace_regex() -> Regex {
    Regex::new(r"\s").ok().unwrap()
}

fn format_gql_query_for_hashing(gql_query: &String) -> String {
    String::from(get_whitespace_regex().replace_all(gql_query, ""))
}

fn parse_whitelist_file_contents(contents: String) -> Vec<String> {
    contents
        .split("\n")
        .map(|line| String::from(line))
        .collect()
}

fn write_hash_to_file(hash: String, path: &PathBuf) {
    let opt_file = OpenOptions::new().create(true).append(true).open(path).ok();

    if let Some(mut file) = opt_file {
        let line = hash + "\n";
        file.write(line.as_bytes()).ok();
    }
}

fn whitelist_gql_query(gql_query: &String) {
    let digest = md5::compute(format_gql_query_for_hashing(gql_query));
    let hash = format!("{:x}", digest);

    if let Some(current_dir) = get_current_dir() {
        let path = Path::new(current_dir.as_str()).join(WHITELIST_FILE);

        match read_to_string(&path).ok() {
            Some(contents) => {
                let hashes = parse_whitelist_file_contents(contents);

                if !hashes.contains(&hash) {
                    write_hash_to_file(hash, &path);
                }
            }
            None => {
                write_hash_to_file(hash, &path);
            }
        }
    }
}

fn build_gql_query_node(mut gql_query: String) -> Option<Box<Expr>> {
    gql_query.insert_str(0, "'");
    gql_query.push_str("'");
    let value = Str::from_tpl_raw(&gql_query);
    let raw = Some(value.clone());

    Some(Box::new(Expr::Lit(Lit::Str(Str {
        raw,
        span: DUMMY_SP,
        value,
    }))))
}

impl VisitMut for TransformVisitor {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module_node: &mut Module) {
        module_node.visit_mut_children_with(self);

        if let Some(index) = get_import_gql_index(module_node) {
            module_node.body.remove(index);
        }
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        let tagged_tpl = get_tagged_tpl(node);

        if !is_ident_import_gql(tagged_tpl.clone()) {
            return;
        }

        if let Some(gql_query) = get_gql_query(tagged_tpl) {
            whitelist_gql_query(&gql_query);
            node.init = build_gql_query_node(gql_query);
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}

test_inline!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    test_transform_gql_import,
    // Input codes
    r#"
      import importGql from './packages/gql.macro/src/macro';
      const GET_CONFIG = importGql`fixtures/query.gql`;
      export default GET_CONFIG;
    "#,
    // Output codes after transformed with plugin
    r#"
      const GET_CONFIG = '{ organization(login: "facebook") { name } }';
      export default GET_CONFIG;
    "#
);
