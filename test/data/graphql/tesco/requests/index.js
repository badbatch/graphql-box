/**
 *
 * @type {string}
 */
export const aliasQuery = `
  {
    favourite: product(id: "402-5806") {
      id
      optionsInfo {
        type
        name
        internalName
      }
      userActionable
      cost: prices {
        id
        price
        clubcardPoints
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const partOneQuery = `
  {
    product(id: "402-5806") {
      id
      optionsInfo {
        type
        name
      }
      userActionable
      prices {
        id
        price
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const partTwoQuery = `
  {
    product(id: "402-5806") {
      optionsInfo {
        internalName
      }
      prices {
        clubcardPoints
        id
      }
      id
    }
  }
`;

/**
 *
 * @type {string}
 */
export const singleQuery = `
  {
    product(id: "402-5806") {
      id
      optionsInfo {
        type
        name
        internalName
      }
      userActionable
      prices {
        id
        price
        clubcardPoints
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const variableQuery = `
  query ($id: String!) {
    product(id: $id) {
      id
      optionsInfo {
        type
        name
        internalName
      }
      userActionable
      prices {
        id
        price
        clubcardPoints
      }
    }
  }
`;
