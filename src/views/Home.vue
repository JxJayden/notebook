<template>
  <div class="home">
    <header class="home__header">
      <h1 class="home__header__title">记事本-记录生活</h1>
      <h2 class="home__header__subtitle">{{currentDate | subtitleDateFormat}}</h2>
    </header>
    <main class="home__main">
      <List :list="notes"/>
    </main>
    <router-link tag="button" class="home__createButton" :to="{name: 'edit'}">添加笔记</router-link>
  </div>
</template>

<script>
import { getNotes } from '@/utils/note';
import List from '@/components/List.vue';

export default {
  name: 'Home',
  components: { List },
  data() {
    return {
      currentDate: new Date()
    };
  },
  computed: {
    notes() {
      return getNotes();
    }
  },
  filters: {
    subtitleDateFormat(date) {
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      return `${date.getMonth() + 1}月${date.getDate()}日  星期${
        weekDays[date.getUTCDay()]
      }`;
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  &__header {
    height: 120px;
    width: 100vw;
    background: url('../assets/images/header_bg.png') left center/cover;
    padding: 43px 15px 0 15px;
    &__title {
      font-size: 24px;
      color: #fff;
      font-weight: 400;
    }
    &__subtitle {
      margin-top: 5px;
      font-size: 17px;
      color: #fff;
      font-weight: 400;
    }
  }
  &__main {
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
  &__createButton {
    z-index: 999;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    font-size: 17px;
    color: #4261e0;
    background: #fff;
    box-shadow: 0 -2px 8px 0 rgba(212, 212, 212, 0.2);
    border-top: 1px solid #eff2f7;
    cursor: pointer;
    padding: 20px;
    text-align: left;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      background: url('../assets/images/icon_add.png') center center/cover
        no-repeat;
      width: 16px;
      height: 16px;
      margin-right: 10px;
    }
  }
}
</style>
