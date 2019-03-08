import { STORAGE_KEY, VERSION } from '../constants';
import storage from './storage';

let cacheNote;

export const filterDeleteNotes = notes =>
  Array.isArray(notes) ? notes.filter(note => !note.isDelete) : [];

export const getNotes = () => {
  try {
    if (cacheNote && cacheNote.length) return cacheNote;
    cacheNote = filterDeleteNotes(JSON.parse(storage.read(STORAGE_KEY.NOTES)));
    return cacheNote;
  } catch (error) {
    return [];
  }
};

export const setNotes = notes => {
  if (!notes || !Array.isArray(notes)) return;
  storage.write(STORAGE_KEY.NOTES, JSON.stringify(notes));
  cacheNote = filterDeleteNotes(notes);
  return cacheNote;
};

export const getNoteById = id => getNotes().find(note => note.id === id);

export const updateNote = ({ id, content }) => {
  const notes = getNotes();
  const updateNoteIndex = notes.findIndex(note => note.id === id);
  const originalNote = notes[updateNoteIndex];
  if (updateNoteIndex !== -1) {
    notes[updateNoteIndex] = {
      ...originalNote,
      content: content,
      updateTime: new Date().getTime()
    };
    setNotes(notes);
    return notes;
  } else {
    return addNote({ id, content });
  }
};

export const addNote = note => {
  const notes = getNotes();
  notes.unshift({
    ...note,
    updateTime: new Date().getTime(),
    createTime: new Date().getTime(),
    isDelete: 0
  });
  setNotes(notes);
};

export const deleteNote = ({ id }) => {
  const notes = getNotes();
  const deleteNoteIndex = notes.findIndex(note => note.id === id);
  if (deleteNoteIndex) {
    notes[deleteNoteIndex].isDelete = 1;
    setNotes(notes);
  }
  return notes;
};

export const checkVersionAndUpdateNote = () => {
  const version = storage.read('version');
  if (version === VERSION) return;

  let notes = getNotes();
  notes = notes.map(note => ({
    id: note.id,
    content: note.content,
    updateTime: note.updateTime || note.date,
    createTime: note.createTime || note.date,
    isDelete: note.isDelete || 0
  }));

  setNotes(notes);
  storage.write('version', VERSION);
};

export default {
  getNotes,
  setNotes,
  updateNote,
  addNote,
  deleteNote,
  getNoteById
};
