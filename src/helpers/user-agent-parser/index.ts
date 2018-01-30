const chrome = /chrome|crios|crmo/i;
const chromeVersion = /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i; // first match
const edge = /edg([ea]|ios)/i;
const edgeVersion = /edg([ea]|ios)\/(\d+(\.\d+)?)/i; // second match
const firefox = /firefox|iceweasel|fxios/i;
const firefoxVersion = /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i; // first match
const ie = /msie|trident/i;
const ieVersion = /(?:msie|rv:)(\d+(\.\d+)?)/i; // first match
const safari = /safari|applewebkit/i;
const safariVersion = /version\/(\d+(\.\d+)?)/i; // first match
const android = /android/i;
const androidVersion = /version\/(\d+(\.\d+)?)/i; // first match
const ios = /(ipod|iphone|ipad)/i;
const iosVersion = /version\/(\d+(\.\d+)?)/i; // first match

export function isChrome(ua: string): boolean {
  return chrome.test(ua);
}

export function getChromeVersion(ua: string): number {
  const match = ua.match(chromeVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isEdge(ua: string): boolean {
  return edge.test(ua);
}

export function getEdgeVersion(ua: string): number {
  const match = ua.match(edgeVersion);
  if (!match) return 0;
  return Number(match[2]);
}

export function isFirefox(ua: string): boolean {
  return firefox.test(ua);
}

export function getFirefoxVersion(ua: string): number {
  const match = ua.match(firefoxVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isIE(ua: string): boolean {
  return ie.test(ua);
}

export function getIEVersion(ua: string): number {
  const match = ua.match(ieVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isSafari(ua: string): boolean {
  return safari.test(ua);
}

export function getSafariVersion(ua: string): number {
  const match = ua.match(safariVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isAndroid(ua: string): boolean {
  return android.test(ua);
}

export function getAndroidVersion(ua: string): number {
  const match = ua.match(androidVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isIOS(ua: string): boolean {
  return ios.test(ua);
}

export function getIOSVersion(ua: string): number {
  const match = ua.match(iosVersion);
  if (!match) return 0;
  return Number(match[1]);
}

export function isSupportedBrowser(ua: string): boolean {
  return isIE(ua) || isEdge(ua) || isSafari(ua) || isFirefox(ua) || isChrome(ua);
}

export function isFirefoxVersionAbove36(ua: string): boolean {
  return isFirefox(ua) && getFirefoxVersion(ua) > 36;
}

export function isSafariVersionAbove10(ua: string): boolean {
  return isSafari(ua) && getSafariVersion(ua) > 10;
}

export function supportsWorkerIndexedDB(ua: string): boolean {
  return !isIE(ua) && !isEdge(ua) && (isFirefoxVersionAbove36(ua) || isSafariVersionAbove10(ua) || isChrome(ua));
}
