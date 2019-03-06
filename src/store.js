import Vue from 'vue';
import Vuex from 'vuex';
import storage from '@/utils/storage';
import { STORAGE_KEY } from '@/constants';

// mutation-types
const UPDATE_NOTES = 'UPDATE_NOTES';

function storagePlugin(store) {
  try {
    const notes = JSON.parse(storage.read(STORAGE_KEY.NOTES));
    const draft = JSON.parse(storage.read(STORAGE_KEY.DRAFT));
    const state = store.state;
    store.replaceState({
      notes: notes && Array.isArray(notes) ? notes : state.notes,
      draft: draft || state.draft
    });
  } catch (error) {}

  store.subscribe((mutation, state) => {
    if (mutation.type === UPDATE_NOTES) {
      storage.write('notes', JSON.stringify(state.notes));
    }
  });
}

Vue.use(Vuex);
/*
each note item:
{
  id: uuid,
  content: '',
  date: ''
}

draft:
{
  id: uuid,
  content: '',
  date: ''
}
*/
export default new Vuex.Store({
  state: {
    notes: [],
    draft: null
  },
  mutations: {
    [UPDATE_NOTES](state, notes) {
      state.notes = notes;
    }
  },
  actions: {
    updateNote({ commit, state, getters, dispatch }, note) {
      const { id } = note;
      const notes = state.notes;
      const noteIndex = notes.findIndex(note => note.id === id);
      if (noteIndex === -1) {
        dispatch('addNote', note);
      } else {
        const newNotes = [...notes];
        newNotes.splice(noteIndex, 1);
        newNotes.unshift({ ...note });
        commit(UPDATE_NOTES, newNotes);
      }
    },
    addNote({ commit, state }, note) {
      commit(UPDATE_NOTES, [{ ...note }, ...state.notes]);
    }
  },
  getters: {
    getNoteById: state => id => state.notes.find(note => note.id === id)
  },
  plugins: [storagePlugin]
});
