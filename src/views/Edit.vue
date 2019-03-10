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
        @change="updateNote"
        @input="setEditorHeight"
        @focus="handleTextareaFocus"
        @blur="handleTextareaBlur"
      ></textarea>
    </main>
  </div>
</template>

<script>
import * as notedb from '@/utils/note-v3';
import uuid from '@/utils/uuid';
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
    id ? this.revertOldNote(id) : this.genNewNote();
  },
  mounted() {
    this.setEditorHeight();
    this.focusTextarea();
  },
  beforeDestroy() {
    this.cancelSaveInterval();
    this.updateNote();
  },
  methods: {
    // note control
    revertOldNote(id) {
      notedb
        .getOneById(id)
        .then(note => {
          if (!note) {
            this.$router.replace({ name: 'edit' });
          } else {
            this.id = id;
            this.content = note.content;
            this.oldContent = note.content;
            this.date = note.updateTime;
          }
        })
        .catch(() => {
          this.$router.replace({ name: 'edit' });
        });
    },
    genNewNote() {
      this.id = uuid();
      this.date = new Date().getTime();
    },
    updateNote() {
      if (this.oldContent === this.content) return;
      this.oldContent = this.content;
      notedb.update(this.id, this.content).catch(error => {
        if (
          error.name === 'QUOTA_EXCEEDED_ERR' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          alert('缓存空间不足，请删减文字～');
        } else {
          alert('数据缓存失败');
        }
      });
    },
    // event handler
    handleClickDelete() {
      notedb
        .remove(this.id)
        .then(() => {
          this.goHome();
        })
        .catch(error => {
          if (
            error.name === 'QUOTA_EXCEEDED_ERR' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
          ) {
            alert('缓存空间不足，请删减文字～');
          } else {
            alert('删除操作失败，请重试');
          }
        });
    },
    handleClickSave() {
      notedb
        .update(this.id, this.content)
        .then(() => {
          this.goHome();
        })
        .catch(error => {
          if (
            error.name === 'QUOTA_EXCEEDED_ERR' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
          ) {
            alert('缓存空间不足，请删减文字～');
          } else {
            alert('数据缓存失败');
          }
        });
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
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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
    min-height: calc(100vh - 50px);
    margin-top: 44px;
  }
  &__editor {
    overflow-y: hidden;
    padding: 8px 15px;
    width: 100%;
    font-size: 15px;
    color: #6d6c79;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
