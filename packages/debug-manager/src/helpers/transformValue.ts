import { JsonValue } from "type-fest";

export default (value?: JsonValue) => (value ? { value: JSON.stringify(value) } : {});
