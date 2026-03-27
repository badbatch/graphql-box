export class NetworkError extends Error {
  public name = 'NetworkError';

  constructor(
    public message: string,
    public status?: number,
    public statusText?: string,
  ) {
    super(message);
  }
}
