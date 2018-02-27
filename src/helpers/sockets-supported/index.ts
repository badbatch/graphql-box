export default function socketsSupported(): boolean {
  if (!process.env.WEB_ENV) return true;
  return !!self.WebSocket;
}
