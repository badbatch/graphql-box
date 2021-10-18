import { ConnectionInputOptions } from "../defs";

export default ({ after, before }: Record<string, any> & ConnectionInputOptions) => !!(after || before);
