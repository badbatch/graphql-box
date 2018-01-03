export const singleQuery = `
  {
    product(id: "402-5806") {
      defaultSku {
        displayName
        parentProduct {
          optionsInfo {
            internalName
            name
            type
          }
          prices {
            clubcardPoints
            price
          }
          userActionable
        }
        publicLink
      }
      optionsInfo {
        internalName
        name
        type
      }
      prices {
        clubcardPoints
        price
      }
      userActionable
    }
  }
`;

export const reducedSingleQuery = `
  {
    product(id: "402-5806") {
      defaultSku {
        displayName
        parentProduct {
          optionsInfo {
            internalName
            name
            type
          }
          prices {
            clubcardPoints
            price
          }
          userActionable
        }
        publicLink
      }
      optionsInfo {
        internalName
        name
        type
      }
      prices {
        clubcardPoints
        price
      }
    }
  }
`;

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

export const optionsInfoFragment = `
  fragment OptionsInfoFragment on ProductOptionsInfo {
    type
    name
    internalName
  }
`;

export const priceFragment = `
  fragment PricesFragment on Prices {
    id
    price
    clubcardPoints
  }
`;

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

export const multiItemQuery = `
  query getProducts($id: [String]) {
    products(id: $id) {
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
