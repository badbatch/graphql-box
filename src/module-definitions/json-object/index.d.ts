declare module "*.json" {
  export default interface JsonObject {
    [key: string]: any;
  }
}
