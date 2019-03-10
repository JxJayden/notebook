import Vue from 'vue';
import App from './App.vue';
import router from './router';
import * as notedb from './utils/note-v3';
// import localforage from 'localforage';
Vue.config.productionTip = false;

Vue.filter('dateFormat', function(dateTime) {
  if (Number.isNaN(dateTime) || typeof dateTime !== 'number') return '';
  return new Date(dateTime).toLocaleString();
});

notedb
  .ready()
  .then(() => {
    notedb.config();
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  })
  .catch(() => {
    alert('您的浏览器暂不支持 indexedDB 和 localStorage，请更换浏览器使用。');
  });
