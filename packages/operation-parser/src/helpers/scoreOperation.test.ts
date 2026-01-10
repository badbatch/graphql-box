import { scoreOperation } from '#helpers/scoreOperation.ts';

describe('scoreOperation', () => {
  describe('fieldDepth', () => {
    it('should return the expected fieldDepth from the depthChart', () => {
      const depthChart = {
        'organization.__typename': 2,
        'organization.description': 2,
        'organization.email': 2,
        'organization.id': 2,
        'organization.login': 2,
        'organization.name': 2,
        'organization.repositories.edges.node.__typename': 5,
        'organization.repositories.edges.node.description': 5,
        'organization.repositories.edges.node.homepageUrl': 5,
        'organization.repositories.edges.node.id': 5,
        'organization.repositories.edges.node.name': 5,
      };

      const { fieldDepth } = scoreOperation({ depthChart, typeOccurrences: {} });
      expect(fieldDepth).toBe(5);
    });
  });

  describe('typeComplexity', () => {
    describe('when typeComplexityMap is not provided', () => {
      it('should return 0', () => {
        const { typeComplexity } = scoreOperation({ depthChart: {}, typeOccurrences: {} });
        expect(typeComplexity).toBe(0);
      });
    });

    describe('when typeComplexityMap is provided', () => {
      it('should return the expected typeComplexity from the typeComplexityMap and typeOccurrences', () => {
        const typeComplexityMap = {
          Organization: 3,
          Repository: 6,
          RepositoryConnection: 5,
          RepositoryEdge: 7,
        };

        const typeOccurrences = {
          Organization: 1,
          Repository: 3,
          RepositoryConnection: 2,
          RepositoryEdge: 1,
        };

        const { typeComplexity } = scoreOperation({ depthChart: {}, typeComplexityMap, typeOccurrences });
        expect(typeComplexity).toBe(38);
      });
    });
  });
});
