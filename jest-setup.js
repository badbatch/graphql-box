import 'isomorphic-fetch';
import { WebSocket } from 'mock-socket';
import queueMicrotask from 'queue-microtask';
import { TextEncoder, TextDecoder } from 'util';

const { DEBUG } = process.env;

if (DEBUG) {
  jest.setTimeout(999999);
}

global.queueMicrotask = queueMicrotask;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.WebSocket = WebSocket;
