<template>
  <div class="edit">
    <nav class="edit__nav">
      <button class="edit__nav__deleteButton" @click="deleteNote"></button>
      <button class="edit__nav__saveButton" @click="saveNote">完成</button>
    </nav>
    <time></time>
    <main class="edit__main">
      <textarea
        ref="editor"
        v-model="content"
        id="textarea"
        @change="updateNote"
        @blur="scrollToTop"
        class="edit__editor"
      ></textarea>
    </main>
  </div>
</template>

<script>
import { getNoteById, updateNote, deleteNote } from '@/utils/note';
import uuid from '@/utils/uuid';

export default {
  name: 'Edit',
  data() {
    return {
      content: '',
      id: ''
    };
  },
  created() {
    const id = this.$route.query.id;
    id ? this.revertOldNote(id) : this.genNewNote();
  },
  mounted() {
    this.$refs.editor.focus();
  },
  methods: {
    revertOldNote(id) {
      const note = getNoteById(id);
      if (!note) {
        this.$router.replace({ name: 'edit' });
      } else {
        this.id = id;
        this.content = note.content;
      }
    },
    genNewNote() {
      this.id = uuid();
    },
    deleteNote() {
      try {
        deleteNote({ id: this.id });
        this.goHome();
      } catch (error) {}
    },
    saveNote() {
      try {
        updateNote({
          id: this.id,
          content: this.content,
          date: new Date().getTime()
        });
        this.goHome();
      } catch (error) {
        if (
          error.name === 'QUOTA_EXCEEDED_ERR' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          alert('缓存空间不足，请删减文字～');
        }
      }
    },
    updateNote() {
      try {
        updateNote({
          id: this.id,
          content: this.content,
          date: new Date().getTime()
        });
      } catch (error) {
        if (
          error.name === 'QUOTA_EXCEEDED_ERR' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          alert('缓存空间不足，请删减文字～');
        }
      }
    },
    scrollToTop() {
      // fix wechat webview not scrolltop after keyboard hidden
      setTimeout(() => {
        document.body.scrollTop = 0;
      });
    },
    goHome() {
      if (window.history.length >= 2) {
        this.$router.back(-1);
      } else {
        this.$router.replace({ name: 'home' });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {
  &__nav {
    height: 44px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
    &__deleteButton {
      background: url('../assets/images/icon_delete.png') center/cover no-repeat;
      width: 18px;
      height: 20px;
      margin-right: 15px;
    }
    &__saveButton {
      font-size: 17px;
      color: #3153df;
      background: transparent;
    }
  }
  &__editor {
    padding: 15px;
    width: 100%;
    height: calc(100vh - 50px);
    font-size: 15px;
    color: #6d6c79;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
