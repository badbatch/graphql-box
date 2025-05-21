const GET_CONFIG = `
query GetConfig {
  config {
    ...ConfigImages
  }
}


fragment ConfigImages on Config {
  images {
    backdropSizes
    logoSizes
    posterSizes
    profileSizes
    stillSizes
    ...ImageUrls
  }
}

fragment ImageUrls on Image {
  baseUrl
  secureBaseUrl
}
`;
export default GET_CONFIG;
