export const singleQuery = `
  query ($id: String!) {
    product(id: $id) {
      defaultSku {
        displayName
        parentProduct {
          optionsInfo {
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
  query ($id: String!) {
    product(id: $id) {
      defaultSku {
        displayName
        parentProduct {
          optionsInfo {
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

export const extendedSingleQuery = `
  query ($id: String!) {
    product(id: $id) {
      brand
      defaultSku {
        displayName
        parentProduct {
          longDescription
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
        rangedInStore
      }
      longDescription
      optionsInfo {
        internalName
        name
        type
      }
      prices {
        clubcardPoints
        price
      }
      publicLink
      userActionable
    }
  }
`;

export const partialSingleQuery = `
  {
    product(id: "402-5806") {
      brand
      defaultSku {
        parentProduct {
          longDescription
          optionsInfo {
            internalName
          }
          _metadata {
            cacheControl
          }
        }
        rangedInStore
        _metadata {
          cacheControl
        }
      }
      longDescription
      optionsInfo {
        internalName
      }
      publicLink
      _metadata {
        cacheControl
      }
    }
  }
`;

export const sugaredSingleQuery = `
  query ProductAndDefaultSkus($id: String!) {
    product(id: $id) {
      primaryChild: defaultSku {
        ...skuFields
      }
      optionsInfo {
        name
        type
      }
      prices {
        ... on Prices {
          clubcardPoints
          price
        }
      }
      userActionable
    }
  }
`;

export const sugaredSingleQueryFragment = `
  fragment skuFields on Sku {
    displayName
    parentProduct {
      optionsInfo {
        name
        type
      }
      prices {
        ... on Prices {
          clubcardPoints
          price
        }
      }
      userActionable
    }
    publicLink
  }
`;

export const batchProductQuery = `
  query ($id: String!) {
    product(id: $id) {
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

export const batchSkuQuery = `
  query ($id: String!) {
    sku(id: $id) {
      displayName
      publicLink
    }
  }
`;

export const addMutation = `
  mutation ($productID: String!) {
    addFavourite(productID: $productID) {
      count
      products {
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
  }
`;

export const reducedAddMutation = `
  mutation ($productID: String!) {
    addFavourite(productID: $productID) {
      count
    }
  }
`;

export const updatedAddMutation = `
  mutation {
    addFavourite(productID: "402-5806") {
      count
      products {
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
  }
`;

export const removeMutation = `
  mutation ($productID: String!) {
    removeFavourite(productID: $productID) {
      count
    }
  }
`;

export const singleSubscription = `
  subscription {
    favouriteAdded {
      count
      products {
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
  }
`;
