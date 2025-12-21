import { getOperationContext, githubIntrospection, rawOperationsAndOptions } from '@graphql-box/test-utils';
import { expect } from '@jest/globals';
import { type IntrospectionQuery, OperationTypeNode } from 'graphql';
import { OperationParser, type OperationParserDef } from './index.ts';

describe('@graphql-box/operation-parser', () => {
  let operationParser: OperationParserDef;

  describe('when query has no variables', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has operation name', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithOperationName;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "query GetOrganization {
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithOperationName;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "GetOrganization",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when the query has a default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"google"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"google"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"google"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"google"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"google"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when the query has a number default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNumberDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "google") {
            description
            email
            login
            name
            repositories(first: 20) {
              edges {
                node {
                  description
                  name
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNumberDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"google"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"google"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"google"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"google"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"google"}).repositories({"first":"20"}).edges[0].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[1].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[2].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[3].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[4].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[5].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[6].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[7].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[8].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[9].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[10].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[11].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[12].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[13].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[14].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[15].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[16].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[17].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[18].node.description",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[19].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
                "organization.repositories.edges[6].node.description",
                "organization.repositories.edges[7].node.description",
                "organization.repositories.edges[8].node.description",
                "organization.repositories.edges[9].node.description",
                "organization.repositories.edges[10].node.description",
                "organization.repositories.edges[11].node.description",
                "organization.repositories.edges[12].node.description",
                "organization.repositories.edges[13].node.description",
                "organization.repositories.edges[14].node.description",
                "organization.repositories.edges[15].node.description",
                "organization.repositories.edges[16].node.description",
                "organization.repositories.edges[17].node.description",
                "organization.repositories.edges[18].node.description",
                "organization.repositories.edges[19].node.description",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"google"}).repositories({"first":"20"}).edges[0].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[1].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[2].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[3].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[4].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[5].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[6].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[7].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[8].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[9].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[10].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[11].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[12].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[13].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[14].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[15].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[16].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[17].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[18].node.name",
                "organization({"login":"google"}).repositories({"first":"20"}).edges[19].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
                "organization.repositories.edges[6].node.name",
                "organization.repositories.edges[7].node.name",
                "organization.repositories.edges[8].node.name",
                "organization.repositories.edges[9].node.name",
                "organization.repositories.edges[10].node.name",
                "organization.repositories.edges[11].node.name",
                "organization.repositories.edges[12].node.name",
                "organization.repositories.edges[13].node.name",
                "organization.repositories.edges[14].node.name",
                "organization.repositories.edges[15].node.name",
                "organization.repositories.edges[16].node.name",
                "organization.repositories.edges[17].node.name",
                "organization.repositories.edges[18].node.name",
                "organization.repositories.edges[19].node.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"google"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when a query has a variable', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when a query has a variable with a default', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableWithDefault;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableWithDefault;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when a query has an enum variable', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithEnumVariable;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                  owner {
                    login
                    url
                    ... on Organization {
                      name
                    }
                  }
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithEnumVariable;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
              ],
            },
            "organization.repositories.edges.node.homepageUrl": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.homepageUrl",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.homepageUrl",
                "organization.repositories.edges[1].node.homepageUrl",
                "organization.repositories.edges[2].node.homepageUrl",
                "organization.repositories.edges[3].node.homepageUrl",
                "organization.repositories.edges[4].node.homepageUrl",
                "organization.repositories.edges[5].node.homepageUrl",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
              ],
            },
            "organization.repositories.edges.node.owner.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.login",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.login",
                "organization.repositories.edges[1].node.owner.login",
                "organization.repositories.edges[2].node.owner.login",
                "organization.repositories.edges[3].node.owner.login",
                "organization.repositories.edges[4].node.owner.login",
                "organization.repositories.edges[5].node.owner.login",
              ],
            },
            "organization.repositories.edges.node.owner.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.name",
                "organization.repositories.edges[1].node.owner.name",
                "organization.repositories.edges[2].node.owner.name",
                "organization.repositories.edges[3].node.owner.name",
                "organization.repositories.edges[4].node.owner.name",
                "organization.repositories.edges[5].node.owner.name",
              ],
            },
            "organization.repositories.edges.node.owner.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.url",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.url",
                "organization.repositories.edges[1].node.owner.url",
                "organization.repositories.edges[2].node.owner.url",
                "organization.repositories.edges[3].node.owner.url",
                "organization.repositories.edges[4].node.owner.url",
                "organization.repositories.edges[5].node.owner.url",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when a query has multiple variables', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            repositories(first: 6, ownerAffiliations: [OWNER, COLLABORATOR]) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                  owner {
                    login
                    url
                    ... on Organization {
                      name
                    }
                  }
                }
              }
            }
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
              ],
            },
            "organization.repositories.edges.node.homepageUrl": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.homepageUrl",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.homepageUrl",
                "organization.repositories.edges[1].node.homepageUrl",
                "organization.repositories.edges[2].node.homepageUrl",
                "organization.repositories.edges[3].node.homepageUrl",
                "organization.repositories.edges[4].node.homepageUrl",
                "organization.repositories.edges[5].node.homepageUrl",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
              ],
            },
            "organization.repositories.edges.node.owner.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.login",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.login",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.login",
                "organization.repositories.edges[1].node.owner.login",
                "organization.repositories.edges[2].node.owner.login",
                "organization.repositories.edges[3].node.owner.login",
                "organization.repositories.edges[4].node.owner.login",
                "organization.repositories.edges[5].node.owner.login",
              ],
            },
            "organization.repositories.edges.node.owner.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.name",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.name",
                "organization.repositories.edges[1].node.owner.name",
                "organization.repositories.edges[2].node.owner.name",
                "organization.repositories.edges[3].node.owner.name",
                "organization.repositories.edges[4].node.owner.name",
                "organization.repositories.edges[5].node.owner.name",
              ],
            },
            "organization.repositories.edges.node.owner.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[0].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[1].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[2].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[3].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[4].node.owner.url",
                "organization({"login":"facebook"}).repositories({"first":"6","ownerAffiliations":["OWNER","COLLABORATOR"]}).edges[5].node.owner.url",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.owner.url",
                "organization.repositories.edges[1].node.owner.url",
                "organization.repositories.edges[2].node.owner.url",
                "organization.repositories.edges[3].node.owner.url",
                "organization.repositories.edges[4].node.owner.url",
                "organization.repositories.edges[5].node.owner.url",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has field alias', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            fullName: name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.fullName": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.fullName",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has an include false directive', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithIncludeFalseDirective;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email @include(if: false)
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithIncludeFalseDirective;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has a skip true directive', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithSkipTrueDirective;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email @skip(if: true)
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithSkipTrueDirective;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has an inline fragment', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragment;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              email
              login
              name
              url
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithAlias;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.fullName": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.fullName",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has an inline fragment with no type condition', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragmentWithNoTypeCondition;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... {
              description
              email
              login
              name
              url
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithInlineFragmentWithNoTypeCondition;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable inside an inline fragment', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragment;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              email
              login
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                  }
                }
              }
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragment;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
              ],
            },
            "organization.repositories.edges.node.homepageUrl": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.homepageUrl",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.homepageUrl",
                "organization.repositories.edges[1].node.homepageUrl",
                "organization.repositories.edges[2].node.homepageUrl",
                "organization.repositories.edges[3].node.homepageUrl",
                "organization.repositories.edges[4].node.homepageUrl",
                "organization.repositories.edges[5].node.homepageUrl",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has a nested fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNestedFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            email
            login
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithNestedFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 2,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.email": {
              "cachePaths": [
                "organization({"login":"facebook"}).email",
              ],
              "responsePaths": [
                "organization.email",
              ],
            },
            "organization.login": {
              "cachePaths": [
                "organization({"login":"facebook"}).login",
              ],
              "responsePaths": [
                "organization.login",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable in a fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            description
            repositories(first: 6) {
              edges {
                node {
                  description
                  homepageUrl
                  name
                }
              }
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
              ],
            },
            "organization.repositories.edges.node.homepageUrl": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.homepageUrl",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.homepageUrl",
                "organization.repositories.edges[1].node.homepageUrl",
                "organization.repositories.edges[2].node.homepageUrl",
                "organization.repositories.edges[3].node.homepageUrl",
                "organization.repositories.edges[4].node.homepageUrl",
                "organization.repositories.edges[5].node.homepageUrl",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query has a variable in an inline fragment in a fragment spread', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragmentInNestedFragmentSpread;
      const operationContext = getOperationContext();
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "{
          organization(login: "facebook") {
            ... on Organization {
              description
              repositories(first: 6) {
                edges {
                  node {
                    description
                    homepageUrl
                    name
                  }
                }
              }
            }
            name
            url
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariableInInlineFragmentInNestedFragmentSpread;
      const operationContext = getOperationContext();
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 5,
            "operationName": "",
            "operationType": "query",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": {
            "organization.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).description",
              ],
              "responsePaths": [
                "organization.description",
              ],
            },
            "organization.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).name",
              ],
              "responsePaths": [
                "organization.name",
              ],
            },
            "organization.repositories.edges.node.description": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.description",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.description",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.description",
                "organization.repositories.edges[1].node.description",
                "organization.repositories.edges[2].node.description",
                "organization.repositories.edges[3].node.description",
                "organization.repositories.edges[4].node.description",
                "organization.repositories.edges[5].node.description",
              ],
            },
            "organization.repositories.edges.node.homepageUrl": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.homepageUrl",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.homepageUrl",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.homepageUrl",
                "organization.repositories.edges[1].node.homepageUrl",
                "organization.repositories.edges[2].node.homepageUrl",
                "organization.repositories.edges[3].node.homepageUrl",
                "organization.repositories.edges[4].node.homepageUrl",
                "organization.repositories.edges[5].node.homepageUrl",
              ],
            },
            "organization.repositories.edges.node.name": {
              "cachePaths": [
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[0].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[1].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[2].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[3].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[4].node.name",
                "organization({"login":"facebook"}).repositories({"first":"6"}).edges[5].node.name",
              ],
              "responsePaths": [
                "organization.repositories.edges[0].node.name",
                "organization.repositories.edges[1].node.name",
                "organization.repositories.edges[2].node.name",
                "organization.repositories.edges[3].node.name",
                "organization.repositories.edges[4].node.name",
                "organization.repositories.edges[5].node.name",
              ],
            },
            "organization.url": {
              "cachePaths": [
                "organization({"login":"facebook"}).url",
              ],
              "responsePaths": [
                "organization.url",
              ],
            },
          },
        }
      `);
    });
  });

  describe('when query field depth exceeds max field depth', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxFieldDepth: 1,
      });
    });

    it('should throw the expected error', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithoutVariable;
      const operationContext = getOperationContext();

      expect(() => {
        operationParser.buildOperationData(operation, options, operationContext);
      }).toThrow('@graphql-box/request-parser >> request field depth of 2 exceeded max field depth of 1');
    });
  });

  describe('when query type complexity is greater than max type complexity', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
        maxTypeComplexity: 9,
        typeComplexityMap: {
          Organization: 4,
          Repository: 2,
          RepositoryOwner: 4,
        },
      });
    });

    it('should throw the expected error', () => {
      const { operation, options } = rawOperationsAndOptions.queryWithVariables;
      const operationContext = getOperationContext();

      expect(() => {
        operationParser.buildOperationData(operation, options, operationContext);
      }).toThrow('@graphql-box/request-parser >> request type complexity of 10 exceeded max type complexity of 9');
    });
  });

  describe('when mutation has an input object type', () => {
    beforeAll(() => {
      operationParser = new OperationParser({
        introspection: githubIntrospection as IntrospectionQuery,
      });
    });

    it('should return the correct operation', () => {
      const { operation, options } = rawOperationsAndOptions.mutationWithInputObjectType;
      const operationContext = getOperationContext({ data: { operationType: OperationTypeNode.MUTATION } });
      const updatedOperation = operationParser.buildOperationData(operation, options, operationContext);

      expect(updatedOperation.operation).toMatchInlineSnapshot(`
        "mutation {
          addStar(
            input: {clientMutationId: "1", starrableId: "MDEwOlJlcG9zaXRvcnkxMDA0NTUxNDg="}
          ) {
            clientMutationId
            starrable {
              ... on Repository {
                stargazers(first: 6) {
                  edges {
                    node {
                      name
                      login
                    }
                  }
                }
              }
            }
          }
        }"
      `);
    });

    it('should enrich the context data as expected', () => {
      const { operation, options } = rawOperationsAndOptions.mutationWithInputObjectType;
      const operationContext = getOperationContext({ data: { operationType: OperationTypeNode.MUTATION } });
      operationParser.buildOperationData(operation, options, operationContext);

      expect(operationContext).toMatchInlineSnapshot(`
        {
          "data": {
            "operationId": "123456789",
            "operationMaxFieldDepth": 6,
            "operationName": "",
            "operationType": "mutation",
            "operationTypeComplexity": undefined,
            "originalOperationHash": "",
          },
          "debugManager": undefined,
          "fieldPaths": undefined,
        }
      `);
    });
  });
});
