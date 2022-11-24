export default async <T>(fetchResult: Response): Promise<T> => ({
  headers: fetchResult.headers,
  ...(await fetchResult.json()),
});
