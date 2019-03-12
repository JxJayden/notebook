<template>
  <div class="edit">
    <nav class="edit__nav">
      <button class="edit__nav__deleteButton" @click="handleClickDelete"></button>
      <button class="edit__nav__saveButton" @click="handleClickSave">完成</button>
    </nav>
    <main class="edit__main" @click="focusTextarea">
      <time class="edit__date">{{date | dateFormat}}</time>
      <textarea
        placeholder="请输入笔记内容～"
        rows="1"
        class="edit__editor"
        ref="editor"
        v-model.trim="content"
        @input="setEditorHeight"
        @change="updateNote"
        @focus="handleTextareaFocus"
        @blur="handleTextareaBlur"
        v-focus
      ></textarea>
    </main>
  </div>
</template>

<script>
import noteApi from '@/api';
import handleError from '@/utils/handleError';

export default {
  name: 'Edit',
  data() {
    return {
      oldContent: '',
      content: '',
      id: '',
      date: '',
      intervalTimer: null
    };
  },
  created() {
    const id = this.$route.query.id;
    this.init(id);
  },
  beforeDestroy() {
    this.cancelSaveInterval();
    this.updateNote();
  },
  methods: {
    init(id) {
      const initNote = id ? this.revertOldNote(id) : this.genNewNote();

      initNote
        .then(({ id, content, updateTime }) => {
          this.id = id;
          this.content = content;
          this.oldContent = content;
          this.date = updateTime;

          this.initTextarea();
        })
        .catch(handleError);
    },
    // note control
    revertOldNote(id) {
      return noteApi.getOneById(id).then(note => {
        if (note) return note;
        this.$router.replace({ name: 'edit' });
      });
    },
    genNewNote() {
      return noteApi.add();
    },
    updateNote() {
      if (this.oldContent === this.content) return;

      this.oldContent = this.content;

      noteApi.update(this.id, this.content).catch(handleError);
    },
    // event handler
    handleClickDelete() {
      noteApi
        .remove(this.id)
        .then(this.goHome)
        .catch(handleError);
    },
    handleClickSave() {
      noteApi
        .update(this.id, this.content)
        .then(this.goHome)
        .catch(handleError);
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
    initTextarea() {
      this.$nextTick(() => {
        this.setEditorHeight();
      });
    },
    focusTextarea() {
      this.$refs.editor.focus();
    },
    setEditorHeight() {
      const ele = this.$refs.editor;
      ele.style.height = 'auto';
      ele.style.height = ele.scrollHeight + 5 + 'px';
    },
    scrollToTop() {
      // fix wechat webview not scrolltop after keyboard hidden
      setTimeout(() => {
        document.body.scrollTop = 0;
      });
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
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    height: 44px;
    padding: 0 15px;

    background: #f5f5f5;
    &__deleteButton {
      width: 18px;
      height: 20px;
      margin-right: 15px;

      background: url('../assets/images/icon_delete.png') center/cover no-repeat;
    }
    &__saveButton {
      font-size: 17px;

      color: #3153df;
      background: transparent;
    }
  }
  &__date {
    font-size: 12px;

    display: block;

    padding: 10px 0;

    text-align: center;

    color: #6d6c79;
  }
  &__main {
    min-height: calc(100vh - 50px);
    margin-top: 44px;
  }
  &__editor {
    font-size: 15px;

    overflow-y: hidden;

    width: 100%;
    padding: 8px 15px;

    color: #6d6c79;

    -webkit-overflow-scrolling: touch;
  }
}
</style>
