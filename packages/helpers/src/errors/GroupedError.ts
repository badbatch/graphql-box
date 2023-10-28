export class GroupedError extends Error {
  public name = 'GroupedError';
  public type = 'Error';
  constructor(public message: string, public errors: Error[]) {
    super(message);
  }
}
