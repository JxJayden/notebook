<template>
  <ul class="list" v-if="list && list.length">
    <router-link
      tag="li"
      v-for="item in list"
      :key="item.id"
      :to="{ name: 'edit', query: { id: item.id } }"
      class="item"
    >
      <p class="item__title">{{ item.content | noteFormat}}</p>
      <time class="item__time">{{item.date | dateFormat}}</time>
      <!-- <button @click.stop="deleteNote(item)" class="deleteButton">删除</button> -->
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
    },
    noteFormat(content) {
      return content.trim().length ? content.trim() : '空白笔记';
    }
  },
  methods: {
    deleteNote(note) {
      this.$emit('delete', note);
    }
  }
};
</script>

<style scoped lang="scss">
.list {
  padding: 0 15px;
  .item {
    height: 77px;
    border-bottom: 1px solid #eff2f7;
    padding-top: 20px;
    cursor: pointer;
    &__title {
      font-size: 17px;
      color: #35343d;
      font-weight: 500;
      max-width: 80vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__time {
      padding-top: 2px;
      font-size: 15px;
      color: #6d6c79;
    }
  }
}
</style>
