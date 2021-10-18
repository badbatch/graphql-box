import { ConnectionInputOptions } from "../defs";

export default ({ after, before }: ConnectionInputOptions) => before || after;
