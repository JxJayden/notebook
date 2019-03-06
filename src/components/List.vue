<template>
  <ul class="list" v-if="list && list.length">
    <router-link
      tag="li"
      v-for="item in list"
      :key="item.id"
      :to="{ name: 'edit', query: { id: item.id } }"
    >{{ item.content }} {{item.date | dateFormat}}
    <button @click.stop="deleteNote(item)" class="deleteButton">删除</button>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    dateFormat(dateTime) {
      if (Number.isNaN(dateTime) || typeof dateTime !== 'number') return '';
      return new Date(dateTime).toLocaleString();
    }
  },
  methods: {
    deleteNote(note) {
      this.$store.dispatch('deleteNote', note);
    }
  }
};
</script>

<style scoped lang="scss"></style>
