import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slices/notesSlice.tsx";
import tabReducer from "./slices/tabSlice.tsx";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    tab: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
