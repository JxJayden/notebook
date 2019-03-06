<template>
  <div class="home">
    <List :list="notes"/>
    <router-link tag="button" class="createButton" :to="{name: 'edit'}">新增</router-link>
  </div>
</template>

<script>
import List from '@/components/List.vue';
export default {
  name: 'Home',
  components: { List },
  computed: {
    notes() {
      return this.$store.state.notes;
    }
  }
};
</script>
<style lang="scss" scoped>
.createButton {
  position: fixed;
  right: 10px;
  bottom: 30px;
}
</style>
