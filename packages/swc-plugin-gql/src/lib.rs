use path_clean::clean;
use regex::Regex;
use std::env;
use std::fs::{read_to_string, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use swc_core::common::DUMMY_SP;
use swc_core::ecma::{
    ast::{Expr, ImportSpecifier, Lit, Module, ModuleDecl, Program, Str, TaggedTpl, VarDeclarator},
    transforms::testing::test,
    visit::{as_folder, noop_visit_mut_type, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};

pub struct TransformVisitor;

const IMPORT_GQL_IDENT: &str = "importGql";
const WHITELIST_FILE: &str = ".gql-query-whitelist";

fn build_gql_query_node(gql_query_path: &Path, gql_query: String) -> Option<Box<Expr>> {
    let mut resolved_gql_query = resolve_gql_imports(gql_query_path, gql_query);
    resolved_gql_query.insert(0, '`');
    resolved_gql_query.push('`');
    let value = Str::from_tpl_raw(&resolved_gql_query);
    let raw = Some(value.clone());

    Some(Box::new(Expr::Lit(Lit::Str(Str {
        raw,
        span: DUMMY_SP,
        value,
    }))))
}

fn format_gql_query_for_hashing(gql_query: &str) -> String {
    String::from(get_whitespace_regex().replace_all(gql_query, ""))
}

fn get_current_dir() -> Option<String> {
    env::current_dir().ok()?.to_str().map(String::from)
}

fn get_expr(node: &mut VarDeclarator) -> Option<Expr> {
    node.init.take().map(unbox)
}

fn get_gql_import_path_regex() -> Regex {
    Regex::new(r#"#import "(.+)""#).ok().unwrap()
}

fn get_gql_query(path_buff: &PathBuf) -> Option<String> {
    read_to_string(path_buff).ok()
}

fn get_gql_query_path(tagged_tpl: Option<TaggedTpl>) -> Option<PathBuf> {
    tagged_tpl
        .and_then(|tagged_tpl| {
            if let Some(tpl_element) = tagged_tpl.tpl.quasis.first() {
                let tpl_element = tpl_element.clone();
                Some(tpl_element)
            } else {
                None
            }
        })
        .and_then(|tpl_element| get_current_dir().map(|current_dir| (tpl_element, current_dir)))
        .map(|(tpl_element, current_dir)| Path::new(&current_dir).join(tpl_element.raw.as_str()))
}

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

fn get_whitespace_regex() -> Regex {
    Regex::new(r"\s").ok().unwrap()
}

fn is_ident_import_gql(tagged_tpl: Option<TaggedTpl>) -> bool {
    tagged_tpl.is_some()
}

fn parse_whitelist_file_contents(contents: String) -> Vec<String> {
    contents.split("\n").map(String::from).collect()
}

fn resolve_gql_imports(gql_query_path: &Path, gql_query: String) -> String {
    let mut gql_imports: Vec<&str> = gql_query
        .split("\n")
        .filter(|line| line.starts_with("#import "))
        .collect();

    let mut other_lines: Vec<String> = gql_query
        .split("\n")
        .filter(|line| !line.starts_with("#import "))
        .map(String::from)
        .collect();

    for gql_import in gql_imports.iter_mut() {
        if let Some(captures) = get_gql_import_path_regex().captures(gql_import) {
            if let Some(capture_group) = captures.get(1) {
                let current_import_path = gql_query_path.parent().unwrap();
                let relative_import_path = Path::new(capture_group.as_str());
                let import_path_buf = clean(current_import_path.join(relative_import_path));

                let maybe_imported_gql_query: Option<String> =
                    get_gql_query(&import_path_buf).map(|imported_gql_query| {
                        resolve_gql_imports(&import_path_buf, imported_gql_query)
                    });

                if let Some(imported_gql_query) = maybe_imported_gql_query {
                    other_lines.push(imported_gql_query);
                }
            }
        }
    }

    other_lines.join("\n")
}

fn unbox<T>(value: Box<T>) -> T {
    *value
}

fn whitelist_gql_query(gql_query: &str) {
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

fn write_hash_to_file(hash: String, path: &PathBuf) {
    let opt_file = OpenOptions::new().create(true).append(true).open(path).ok();

    if let Some(mut file) = opt_file {
        let line = hash + "\n";

        match file.write(line.as_bytes()).ok() {
            Some(_) => {}
            None => {}
        }
    }
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

        if let Some(gql_query_path) = get_gql_query_path(tagged_tpl) {
            let maybe_gql_query = get_gql_query(&gql_query_path);

            if let Some(gql_query) = maybe_gql_query {
                whitelist_gql_query(&gql_query);
                node.init = build_gql_query_node(&gql_query_path, gql_query);
            }
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    test_transform_gql_import,
    r#"
      import importGql from '@graphql-box/swc-plugin-gql';
      const GET_CONFIG = importGql`fixtures/query.gql`;
      export default GET_CONFIG;
    "#
);

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    test_transform_gql_import_with_sub_imports,
    r#"
      import importGql from '@graphql-box/swc-plugin-gql';
      const GET_CONFIG = importGql`fixtures/queries/GetConfig.gql`;
      export default GET_CONFIG;
    "#
);
