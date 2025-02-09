import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slices/notesSlice.tsx";
import tabReducer from "./slices/tabSlice.tsx";
import userReducer from "./slices/userSlice.tsx";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    tab: tabReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
