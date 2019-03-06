<template>
  <div class="edit">
    <textarea v-model="content" @change="updateData" id="textarea" class="edit__core"></textarea>
  </div>
</template>

<script>
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
  methods: {
    revertOldNote(id) {
      const note = this.$store.getters.getNoteById(id);
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
    updateData() {
      this.$store.dispatch('updateNote', {
        id: this.id,
        content: this.content,
        date: new Date().getTime()
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.edit {
  &__core {
    width: 100vw;
    height: 100vh;
  }
}
</style>
