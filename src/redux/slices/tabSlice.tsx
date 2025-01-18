import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabState = {
  idxTab: number;
};

const initialState: TabState = {
  idxTab: 0,
};

export const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setIdxTab: (state, action: PayloadAction<number>) => {
      state.idxTab = action.payload;
    },
  },
});

export const { setIdxTab } = tabSlice.actions;
export default tabSlice.reducer;
