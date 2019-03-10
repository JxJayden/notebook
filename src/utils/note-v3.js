import localforage from 'localforage';
import { DB_NAME } from '../constants';

// model

const genNoteModel = () => ({
  content: '',
  createTime: new Date().getTime(),
  updateTime: new Date().getTime(),
  isDelete: 0
});

const genDeleteNoteModel = note => ({
  content: note.content || '',
  createTime: note.createTime,
  updateTime: new Date().getTime(),
  isDelete: 1
});

const genUpdateNoteModel = (note, content) => ({
  content: content || note.content || '',
  createTime: note.createTime,
  updateTime: new Date().getTime(),
  isDelete: note.isDelete || 0
});

// methods
export const ready = () => localforage.ready();

export const config = (options = {}) =>
  localforage.config({
    ...options,
    name: DB_NAME
  });

export const getOneById = id => localforage.getItem(id);

export const add = (id, content) =>
  localforage.setItem(id, { ...genNoteModel(), content });

export const remove = id =>
  getOneById(id).then(note =>
    !note
      ? Promise.resolve()
      : localforage.setItem(id, genDeleteNoteModel(note))
  );

export const update = (id, content) =>
  getOneById(id).then(note =>
    !note
      ? add(id, content)
      : localforage.setItem(id, genUpdateNoteModel(note, content))
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
