import type { Direction } from '../types.ts';

export const getDirection = (last?: number): Direction => (last ? 'backward' : 'forward');
