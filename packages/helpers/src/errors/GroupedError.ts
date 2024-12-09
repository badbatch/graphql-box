export class GroupedError extends Error {
  public name = 'GroupedError';
  public type = 'Error';

  constructor(
    public message: string,
    public errors: Error[] | readonly Error[],
  ) {
    super(message);
  }
}
