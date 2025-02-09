import { useContext } from 'react';
import { Context } from '#contexts/GraphqlBox/index.ts';

export const useServerActions = () => useContext(Context).serverActions;
