export const singleQuery = `
  query ($id: String!) {
    product(id: $id) {
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
  query ($id: String!) {
    product(id: $id) {
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

// export const namedQuery = `
//   query getProduct {
//     product(id: "402-5806") {
//       id
//       optionsInfo {
//         type
//         name
//         internalName
//       }
//       userActionable
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;

// export const aliasQuery = `
//   {
//     favourite: product(id: "402-5806") {
//       id
//       optionsInfo {
//         type
//         name
//         internalName
//       }
//       userActionable
//       cost: prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;

// export const partOneQuery = `
//   {
//     product(id: "402-5806") {
//       id
//       optionsInfo {
//         type
//         name
//       }
//       userActionable
//       prices {
//         id
//         price
//       }
//     }
//   }
// `;

// export const partTwoQuery = `
//   {
//     product(id: "402-5806") {
//       optionsInfo {
//         internalName
//       }
//       prices {
//         clubcardPoints
//       }
//       _metadata {
//         cacheControl
//       }
//     }
//   }
// `;

// export const variableQuery = `
//   query ($id: String!) {
//     product(id: $id) {
//       id
//       optionsInfo {
//         type
//         name
//         internalName
//       }
//       userActionable
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;

// export const fragmentQuery = `
//   {
//     product(id: "402-5806") {
//       id
//       optionsInfo {
//         ...OptionsInfoFragment
//       }
//       userActionable
//       prices {
//         ...PricesFragment
//       }
//     }
//   }
// `;

// export const optionsInfoFragment = `
//   fragment OptionsInfoFragment on ProductOptionsInfo {
//     type
//     name
//     internalName
//   }
// `;

// export const priceFragment = `
//   fragment PricesFragment on Prices {
//     id
//     price
//     clubcardPoints
//   }
// `;

// export const inlineFragmentQuery = `
//   {
//     product(id: "402-5806") {
//       id
//       optionsInfo {
//         ... on ProductOptionsInfo {
//           type
//           name
//         }
//       }
//       userActionable
//       prices {
//         ... on Prices {
//           price
//         }
//       }
//     }
//   }
// `;

// export const inlineFragmentQueryExtra = `
//   {
//     product(id: "402-5806") {
//       brand
//       id
//       optionsInfo {
//         ... on ProductOptionsInfo {
//           type
//           name
//           internalName
//         }
//       }
//       prices {
//         ... on Prices {
//           price
//           clubcardPoints
//         }
//       }
//       userActionable
//     }
//   }
// `;

// export const inlineFragmentQuerySpied = `
//   {
//     product(id: "402-5806") {
//       brand
//       optionsInfo {
//         ... on ProductOptionsInfo {
//           internalName
//         }
//       }
//       prices {
//         ... on Prices {
//           clubcardPoints
//         }
//       }
//       _metadata {
//         cacheControl
//       }
//     }
//   }
// `;

// export const multiQuery = `
//   query getProduct {
//     product(id: "402-5806") {
//       id
//       optionsInfo {
//         type
//         name
//         internalName
//       }
//       userActionable
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
//   query getSku {
//     sku(id: "104-7702") {
//       id
//       displayName
//       publicLink
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;

// export const skuQuery = `
//   query getSku {
//     sku(id: "104-7702") {
//       id
//       displayName
//       publicLink
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;

// export const multiItemQuery = `
//   query getProducts($id: [String]) {
//     products(id: $id) {
//       id
//       optionsInfo {
//         type
//         name
//         internalName
//       }
//       userActionable
//       prices {
//         id
//         price
//         clubcardPoints
//       }
//     }
//   }
// `;
