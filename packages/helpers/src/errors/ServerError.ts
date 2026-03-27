export class ServerError extends Error {
  public name = 'ServerError';

  constructor(
    public message: string,
    public errors: Error[] | readonly Error[],
    public status: number,
  ) {
    super(message);
  }
}
