import Vue from 'vue';
import App from './App.vue';
import router from './router';
import noteApi from './api';

Vue.config.productionTip = false;

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  }
});

Vue.filter('dateFormat', function(dateTime) {
  if (Number.isNaN(dateTime) || typeof dateTime !== 'number') return '';
  return new Date(dateTime).toLocaleString();
});

noteApi
  .ready()
  .then(() => {
    noteApi.config();
    noteApi.restoreOldData();
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  })
  .catch(() => {
    alert('您的浏览器暂不支持 indexedDB 和 localStorage，请更换浏览器使用。');
  });
