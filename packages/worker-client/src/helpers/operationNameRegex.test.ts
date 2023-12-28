import { operationNameRegex } from './operationNameRegex.ts';

describe('operationNameRegex', () => {
  describe('when request does not have operation type', () => {
    const request = `
      {
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('');
    });
  });

  describe('when request does not have operation name', () => {
    const request = `
      query {
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('');
    });
  });

  describe('when request has operation name but no arguments', () => {
    const request = `
      query HeroNameAndFriends {
        hero(episode: $episode) {
          name
          friends {
            name
          }
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('HeroNameAndFriends');
    });
  });

  describe('when request has operation name and arguments', () => {
    const request = `
      query HeroNameAndFriends($episode: Episode = JEDI) {
        hero(episode: $episode) {
          name
          friends {
            name
          }
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('HeroNameAndFriends');
    });
  });

  describe('when request is mutation', () => {
    const request = `
      mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
        createReview(episode: $ep, review: $review) {
          stars
          commentary
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('CreateReviewForEpisode');
    });
  });

  describe('when request is subscription', () => {
    const request = `
      subscription OnCommentAdded($postID: ID!) {
        commentAdded(postID: $postID) {
          id
          content
        }
      }
    `;

    it('should return the correct value', () => {
      expect(operationNameRegex(request)).toBe('OnCommentAdded');
    });
  });
});
