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
      <time class="item__time">{{item.updateTime | dateFormat}}</time>
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
    noteFormat(content) {
      return content && content.trim().length ? content.trim() : '空白笔记';
    }
  }
};
</script>

<style scoped lang="scss">
.list {
  padding: 0 15px;
  .item {
    height: 77px;
    padding-top: 20px;

    cursor: pointer;

    border-bottom: 1px solid #eff2f7;
    &__title {
      font-size: 17px;
      font-weight: 500;

      overflow: hidden;

      max-width: 80vw;

      white-space: nowrap;
      text-overflow: ellipsis;

      color: #35343d;
    }
    &__time {
      font-size: 15px;

      display: block;

      padding-top: 5px;

      color: #6d6c79;
    }
  }
}
</style>
