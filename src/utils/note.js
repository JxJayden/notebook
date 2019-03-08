import { STORAGE_KEY, VERSION } from '../constants';
import storage from './storage';
// util
export const getArray = arr => (Array.isArray(arr) ? arr : []);

let cacheNotes;

export const filterDeleteNotes = notes =>
  Array.isArray(notes) ? notes.filter(note => !note.isDelete) : [];

export const getAllNotes = () => {
  try {
    if (cacheNotes && cacheNotes.length) return cacheNotes;
    return (cacheNotes = getArray(JSON.parse(storage.read(STORAGE_KEY.NOTES))));
  } catch (error) {
    return [];
  }
};

export const getNotes = () => filterDeleteNotes(getAllNotes());

export const setNotes = notes => {
  if (!notes || !Array.isArray(notes)) return;
  storage.write(STORAGE_KEY.NOTES, JSON.stringify(notes));
  cacheNotes = [...notes];
  return getNotes();
};

export const getNoteById = id => getNotes().find(note => note.id === id);

export const addNote = note => {
  const notes = getAllNotes();
  notes.unshift({
    ...note,
    updateTime: new Date().getTime(),
    createTime: new Date().getTime(),
    isDelete: 0
  });
  setNotes(notes);
  return getNotes();
};

export const updateNote = ({ id, content }) => {
  const notes = getAllNotes();
  const updateNoteIndex = notes.findIndex(note => note.id === id);
  const originalNote = notes[updateNoteIndex];
  if (updateNoteIndex !== -1) {
    notes[updateNoteIndex] = {
      ...originalNote,
      content: content,
      updateTime: new Date().getTime()
    };
    setNotes(notes);
    return getNotes();
  } else {
    return addNote({ id, content });
  }
};

export const deleteNote = ({ id }) => {
  const notes = getAllNotes();
  const deleteNoteIndex = notes.findIndex(note => note.id === id);
  if (deleteNoteIndex !== -1) {
    notes[deleteNoteIndex].isDelete = 1;
    setNotes(notes);
  }
  return getNotes();
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
