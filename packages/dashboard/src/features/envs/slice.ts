import { createAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { encode } from 'js-base64';
import { type Env, type Store } from '../../types.ts';
import { stepsCreated } from '../steps/slice.ts';
import { sortSteps } from './helpers.ts';

const envsAdapter = createEntityAdapter<Env>();

export const envsSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(stepsCreated, (state, action) => {
      const envs = Object.keys(action.payload).reduce((acc: Record<string, Env>, key) => {
        const step = action.payload[key];

        if (!step) {
          return acc;
        }

        const id = encode(`${step.requestGroup}::${step.logGroup}`);

        const env = acc[id] ?? {
          id,
          label: step.env,
          logGroup: step.logGroup,
          requestGroup: step.requestGroup,
          steps: [],
          timestamp: '',
        };

        env.steps.push(step.id);
        env.steps.sort(sortSteps(action.payload));
        env.timestamp = env.steps[0] ? action.payload[env.steps[0]]?.timestamp ?? '' : '';
        acc[id] = env;
        return acc;
      }, {});

      envsAdapter.upsertMany(state, envs);
    });
  },
  initialState: envsAdapter.getInitialState(),
  name: 'envs',
  reducers: {},
});

export const envsCreated = createAction<Record<string, Env>>('envs/envsCreated');

const {
  selectAll: selectAllEnvs,
  selectById: selectEnvById,
  selectEntities: selectEnvEntities,
  selectIds: selectEnvIds,
  selectTotal: selectEnvTotal,
} = envsAdapter.getSelectors<Store>(state => state.envs);

export { selectAllEnvs, selectEnvById, selectEnvEntities, selectEnvIds, selectEnvTotal };
