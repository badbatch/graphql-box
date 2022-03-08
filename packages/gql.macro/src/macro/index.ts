import { createMacro } from "babel-plugin-macros";
import handler from "./handler";

export default createMacro(handler, {
  configName: "gql",
});
