import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NoteItem = {
  id: string;
  timestamp: {
    date: string;
    time: string;
    dayWeek: {
      full: string;
      short: string;
    };
  };
  mood: number;
  activities: number[];
  desc: string;
};

type NotesState = {
  notes: NoteItem[];
};

const initialState: NotesState = {
  notes: [],
};

export const notesSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<NoteItem[]>) => {
      state.notes = action.payload;
    },
  },
});

export const { setNotes } = notesSlice.actions;
export default notesSlice.reducer;
