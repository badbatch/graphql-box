import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type Ui } from '../../types.ts';

export const uiSlice = createSlice({
  initialState: { logEntryModal: '', requestDiffModal: [], requestVersionDialog: '' } as Ui,
  name: 'ui',
  reducers: {
    logEntryModal: (state, action: PayloadAction<string>) => {
      state.logEntryModal = action.payload;
    },
    requestDiffModal: (state, action: PayloadAction<[string, string, string] | []>) => {
      state.requestDiffModal = action.payload;
    },
    requestVersionDialog: (state, action: PayloadAction<string>) => {
      state.requestVersionDialog = action.payload;
    },
  },
});

export const { logEntryModal, requestDiffModal, requestVersionDialog } = uiSlice.actions;
