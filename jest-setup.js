import 'isomorphic-fetch';
import { WebSocket } from 'mock-socket';

global.WebSocket = WebSocket;
