import { ConnectionInputOptions, PlainObject } from "../defs";

export default ({ after, before }: PlainObject & ConnectionInputOptions) => !!(after || before);
