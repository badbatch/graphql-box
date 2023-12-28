import { useContext } from 'react';
import { Context } from '../contexts/GraphqlBox/index.ts';

export const useGraphqlBoxClient = () => useContext(Context).graphqlBoxClient;
