import { STORAGE_KEY } from '../constants';
import storage from './storage';

let cacheNote;

export const getNotes = () => {
  try {
    if (cacheNote && cacheNote.length) return cacheNote;
    const notes = JSON.parse(storage.read(STORAGE_KEY.NOTES));
    if (notes && Array.isArray(notes)) {
      cacheNote = notes;
      return notes;
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const setNotes = notes => {
  if (!notes || !Array.isArray(notes)) return;
  cacheNote = [...notes];
  storage.write(STORAGE_KEY.NOTES, JSON.stringify(cacheNote));
  return cacheNote;
};

export const getNoteById = id => getNotes().find(note => note.id === id);

export const updateNote = note => {
  const notes = getNotes();
  const id = note.id;
  const updateNoteIndex = notes.findIndex(note => note.id === id);
  if (updateNoteIndex !== -1) {
    notes.splice(updateNoteIndex, 1);
    notes.unshift({ ...note });
    setNotes(notes);
    return notes;
  } else {
    return addNote(note);
  }
};

export const addNote = note => {
  const notes = getNotes();
  notes.unshift({ ...note });
  setNotes(notes);
};

export const deleteNote = ({ id }) => {
  const notes = getNotes();
  const deleteNoteIndex = notes.findIndex(note => note.id === id);
  if (deleteNoteIndex !== -1) {
    notes.splice(deleteNoteIndex, 1);
    setNotes(notes);
  }
  return notes;
};

export default {
  getNotes,
  setNotes,
  updateNote,
  addNote,
  deleteNote,
  getNoteById
};
