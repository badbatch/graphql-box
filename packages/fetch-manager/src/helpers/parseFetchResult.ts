export default async (fetchResult: Response) => ({
  headers: fetchResult.headers,
  ...(await fetchResult.json()),
});
