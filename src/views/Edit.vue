<template>
  <div class="edit">
    <nav class="edit__nav">
      <button class="edit__nav__deleteButton" @click="handleClickDelete"></button>
      <button class="edit__nav__saveButton" @click="handleClickSave">完成</button>
    </nav>
    <time class="edit__date">{{date | dateFormat}}</time>
    <main class="edit__main" @click="focusTextarea">
      <textarea
        rows="1"
        class="edit__editor"
        ref="editor"
        v-model.trim="content"
        @change="updateNote"
        @input="setEditorHeight"
        @focus="handleTextareaFocus"
        @blur="handleTextareaBlur"
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
      oldContent: '',
      content: '',
      id: '',
      date: null,
      intervalTimer: null
    };
  },
  created() {
    const id = this.$route.query.id;
    id ? this.revertOldNote(id) : this.genNewNote();
  },
  mounted() {
    this.setEditorHeight();
  },
  beforeDestroy() {
    this.cancelSaveInterval();
    this.updateNote();
  },
  methods: {
    // note control
    revertOldNote(id) {
      const note = getNoteById(id);
      if (!note) {
        this.$router.replace({ name: 'edit' });
      } else {
        this.id = id;
        this.content = note.content;
        this.oldContent = note.content;
        this.date = note.date;
      }
    },
    genNewNote() {
      this.id = uuid();
      this.date = new Date().getTime();
    },
    deleteNote(cb) {
      try {
        deleteNote({ id: this.id });
        cb && cb();
      } catch (error) {
        if (
          error.name === 'QUOTA_EXCEEDED_ERR' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          alert('缓存空间不足，请删减文字～');
        } else {
          alert('删除操作失败，请重试');
        }
      }
    },
    updateNote(cb) {
      try {
        if (this.oldContent !== this.content) {
          this.date = new Date().getTime();
          this.oldContent = this.content;
          updateNote({
            id: this.id,
            content: this.content,
            date: this.date
          });
        }
        cb && typeof cb === 'function' && cb();
      } catch (error) {
        if (
          error.name === 'QUOTA_EXCEEDED_ERR' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          alert('缓存空间不足，请删减文字～');
        } else {
          alert('数据缓存失败');
        }
      }
    },
    // event handler
    handleClickDelete() {
      this.deleteNote(this.goHome);
    },
    handleClickSave() {
      this.updateNote(this.goHome);
    },
    handleTextareaBlur() {
      this.scrollToTop();
      this.cancelSaveInterval();
    },
    handleTextareaFocus() {
      this.setSaveInterval();
    },
    // interval func
    setSaveInterval() {
      this.intervalTimer = setInterval(() => {
        this.updateNote();
      }, 1000);
    },
    cancelSaveInterval() {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    },
    // dom control
    focusTextarea() {
      this.$refs.editor.focus();
    },
    scrollToTop() {
      // fix wechat webview not scrolltop after keyboard hidden
      setTimeout(() => {
        document.body.scrollTop = 0;
      });
    },
    setEditorHeight() {
      const ele = this.$refs.editor;
      ele.style.height = 'auto';
      ele.style.height = ele.scrollHeight + 5 + 'px';
    },
    goHome() {
      window.history.length >= 2
        ? this.$router.back(-1)
        : this.$router.replace({ name: 'home' });
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
  &__date {
    display: block;
    padding: 10px 0;
    font-size: 12px;
    color: #6d6c79;
    text-align: center;
  }
  &__main {
    min-height: calc(100vh - 80px);
  }
  &__editor {
    padding: 8px 15px;
    width: 100%;
    overflow-y: hidden;
    font-size: 15px;
    color: #6d6c79;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
