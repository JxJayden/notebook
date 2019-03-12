import localforage from 'localforage';
import uuid from '../utils/uuid';
import { DB_NAME, VERSION } from '../constants';

// utils
const getCurrentDate = () => new Date().getTime();

// model

const genNoteModel = () => ({
  content: '',
  createTime: getCurrentDate(),
  updateTime: getCurrentDate(),
  isDelete: 0
});

const genDeleteNoteModel = note => ({
  content: note.content || '',
  createTime: note.createTime,
  updateTime: getCurrentDate(),
  isDelete: 1
});

const genUpdateNoteModel = (note, content) => ({
  content: content || note.content || '',
  createTime: note.createTime,
  updateTime: getCurrentDate(),
  isDelete: note.isDelete || 0
});

// methods
export const ready = () => localforage.ready();

export const config = (options = {}) =>
  localforage.config({
    ...options,
    name: DB_NAME
  });

export const getOneById = id =>
  localforage.getItem(id).then(data => ({ ...data, id }));

export const add = (id = uuid()) =>
  localforage.setItem(id, genNoteModel()).then(data => ({ ...data, id }));

export const remove = id =>
  getOneById(id).then(note =>
    !note
      ? Promise.resolve()
      : localforage.setItem(id, genDeleteNoteModel(note))
  );

export const update = (id, content) =>
  getOneById(id).then(
    note => note && localforage.setItem(id, genUpdateNoteModel(note, content))
  );

export const list = () => {
  let keyList;

  return localforage
    .keys()
    .then(keys => {
      keyList = keys;
      return Promise.all(keys.map(key => localforage.getItem(key)));
    })
    .then(list => {
      list = list.map((note, index) => ({ ...note, id: keyList[index] }));
      return list
        .filter(note => !note.isDelete)
        .sort((aNote, bNote) => bNote.updateTime - aNote.updateTime);
    });
};

export const restoreOldData = () => {
  try {
    const version = localStorage.getItem('version');
    if (version === VERSION) return;

    const oldNotes = JSON.parse(localStorage.getItem('notes'));
    if (!Array.isArray(oldNotes) || !oldNotes.length) return;

    oldNotes.forEach(note => {
      localforage.setItem(note.id, {
        content: note.content || '',
        createTime: note.createTime || getCurrentDate(),
        updateTime: note.updateTime || getCurrentDate(),
        isDelete: note.isDelete || 0
      });
      localStorage.removeItem('notes');
      localStorage.setItem('version', VERSION);
    });
  } catch (error) {}
};
