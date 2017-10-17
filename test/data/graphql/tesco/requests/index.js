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
export const namedQuery = `
  query getProduct {
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
      }
      _metadata {
        cacheControl
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

/**
 *
 * @type {string}
 */
export const fragmentQuery = `
  {
    product(id: "402-5806") {
      id
      optionsInfo {
        ...OptionsInfoFragment
      }
      userActionable
      prices {
        ...PricesFragment
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const optionsInfoFragment = `
  fragment OptionsInfoFragment on ProductOptionsInfo {
    type
    name
    internalName
  }
`;

/**
 *
 * @type {string}
 */
export const priceFragment = `
  fragment PricesFragment on Prices {
    id
    price
    clubcardPoints
  }
`;

/**
 *
 * @type {string}
 */
export const inlineFragmentQuery = `
  {
    product(id: "402-5806") {
      id
      optionsInfo {
        ... on ProductOptionsInfo {
          type
          name
        }
      }
      userActionable
      prices {
        ... on Prices {
          price
        }
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const inlineFragmentQueryExtra = `
  {
    product(id: "402-5806") {
      brand
      id
      optionsInfo {
        ... on ProductOptionsInfo {
          type
          name
          internalName
        }
      }
      prices {
        ... on Prices {
          price
          clubcardPoints
        }
      }
      userActionable
    }
  }
`;

/**
 *
 * @type {string}
 */
export const inlineFragmentQuerySpied = `
  {
    product(id: "402-5806") {
      brand
      optionsInfo {
        ... on ProductOptionsInfo {
          internalName
        }
      }
      prices {
        ... on Prices {
          clubcardPoints
        }
      }
      _metadata {
        cacheControl
      }
    }
  }
`;

/**
 *
 * @type {string}
 */
export const multiQuery = `
  query getProduct {
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
  query getSku {
    sku(id: "104-7702") {
      id
      displayName
      publicLink
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
export const skuQuery = `
  query getSku {
    sku(id: "104-7702") {
      id
      displayName
      publicLink
      prices {
        id
        price
        clubcardPoints
      }
    }
  }
`;
