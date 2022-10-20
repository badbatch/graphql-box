export default (request: string) => {
  const output = /(query|mutation|subscription) ([A-Za-z]+)(\(| {)/.exec(request);
  return output ? output[2] : "";
};
