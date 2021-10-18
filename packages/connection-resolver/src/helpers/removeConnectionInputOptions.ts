import { pickBy } from "lodash";

const connectionInputOptions = ["after", "before", "first", "last"];

export default <O extends object>(args: O) => pickBy(args, (_value, key) => !connectionInputOptions.includes(key));
