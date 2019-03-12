<template>
  <div class="home">
    <header class="home__header">
      <h1 class="home__header__title">记事本-记录生活</h1>
      <h2 class="home__header__subtitle">{{currentDate | subtitleDateFormat}}</h2>
    </header>
    <main class="home__main" :class="{'is-empty': !notes || !notes.length}">
      <List :list="notes"/>
    </main>
    <router-link tag="button" class="home__createButton" :to="{name: 'edit'}">添加笔记</router-link>
  </div>
</template>

<script>
import noteApi from '@/api';
import List from '@/components/List.vue';

export default {
  name: 'Home',
  components: { List },
  data() {
    return {
      currentDate: new Date(),
      notes: []
    };
  },
  created() {
    noteApi.list().then(list => {
      this.notes = list;
    });
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
    width: 100vw;
    height: 120px;
    padding: 43px 15px 0 15px;

    background: url('../assets/images/header_bg.jpg') left center/cover;
    &__title {
      font-size: 24px;
      font-weight: 400;

      color: #fff;
    }
    &__subtitle {
      font-size: 17px;
      font-weight: 400;

      margin-top: 5px;

      color: #fff;
    }
  }
  &__main {
    overflow-y: auto;

    height: calc(100vh - 186px);

    &.is-empty {
      background: url('../assets/images/empty_bg.jpg') top center/100vw auto
        no-repeat;
    }
  }
  &__createButton {
    font-size: 17px;

    position: fixed;
    z-index: 999;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;

    width: 100%;
    height: 60px;
    padding: 20px;

    cursor: pointer;
    text-align: left;

    color: #4261e0;
    border-top: 1px solid #eff2f7;
    background: #fff;
    box-shadow: 0 -2px 8px 0 rgba(212, 212, 212, 0.2);

    &::before {
      width: 16px;
      height: 16px;
      margin-right: 10px;

      content: '';

      background: url('../assets/images/icon_add.png') center center/cover
        no-repeat;
    }
  }
}
</style>
