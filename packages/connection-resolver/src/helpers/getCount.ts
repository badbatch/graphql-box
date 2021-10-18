import { ConnectionInputOptions } from "../defs";

export default ({ first, last }: ConnectionInputOptions) => (first || last) as number;
