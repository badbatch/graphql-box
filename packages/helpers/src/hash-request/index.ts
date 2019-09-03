import md5 from "md5";

export default function hashRequest(value: string): string {
  return md5(value.replace(/\s/g, ""));
}
