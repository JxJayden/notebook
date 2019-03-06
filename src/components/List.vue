<template>
  <ul class="list" v-if="list && list.length">
    <router-link
      tag="li"
      v-for="item in list"
      :key="item.id"
      :to="{ name: 'edit', query: { id: item.id } }"
    >{{ item.content }} {{item.date | dateFormat}}</router-link>
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
  }
};
</script>

<style scoped lang="scss"></style>
