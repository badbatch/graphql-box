import 'isomorphic-fetch';
import { WebSocket } from 'mock-socket';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.WebSocket = WebSocket;
