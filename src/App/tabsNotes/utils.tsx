import axios from "axios";
import { DATA_URL } from "../assets/api.tsx";

export function deleteNote(noteId: number) {
  axios
    .delete(`${DATA_URL}/${noteId}`)
    .catch((err) => console.error("deleteNote", err));
}

export function createNote(note: object) {
  axios.post(DATA_URL, note).catch((err) => console.error("createNote", err));
}

export function updateNote(note: object) {
  axios
    .patch(`${DATA_URL}/${note.id}`, note)
    .catch((err) => console.error("updateNote", err));
}
