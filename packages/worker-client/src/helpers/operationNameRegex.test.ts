import operationNameRegex from "./operationNameRegex";

describe("operationNameRegex", () => {
  test("when request does not have operation type", () => {
    const request = `
      {
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }
    `;

    expect(operationNameRegex(request)).toBe("");
  });

  test("when request does not have operation name", () => {
    const request = `
      query {
        human(id: "1000") {
          name
          height(unit: FOOT)
        }
      }
    `;

    expect(operationNameRegex(request)).toBe("");
  });

  test("when request has operation name but no arguments", () => {
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

    expect(operationNameRegex(request)).toBe("HeroNameAndFriends");
  });

  test("when request has operation name and arguments", () => {
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

    expect(operationNameRegex(request)).toBe("HeroNameAndFriends");
  });

  test("when request is mutation", () => {
    const request = `
      mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
        createReview(episode: $ep, review: $review) {
          stars
          commentary
        }
      }
    `;

    expect(operationNameRegex(request)).toBe("CreateReviewForEpisode");
  });

  test("when request is subscription", () => {
    const request = `
      subscription OnCommentAdded($postID: ID!) {
        commentAdded(postID: $postID) {
          id
          content
        }
      }
    `;

    expect(operationNameRegex(request)).toBe("OnCommentAdded");
  });
});
