interface ArrayConstructor {
  // isArray does not handle readonly array, need this to be as generic as possible.
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  isArray(arg: readonly any[] | any): arg is readonly any[];
}
