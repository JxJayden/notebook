import Vue from 'vue';
import App from './App.vue';
import router from './router';
import storage from './utils/storage';
import { checkVersionAndUpdateNote } from './utils/note';

Vue.config.productionTip = false;

Vue.filter('dateFormat', function(dateTime) {
  if (Number.isNaN(dateTime) || typeof dateTime !== 'number') return '';
  return new Date(dateTime).toLocaleString();
});

const isSupportstorage = storage.isSupport();

if (!isSupportstorage) {
  alert('您的浏览器暂不支持 localStorage，请更换浏览器使用。');
} else {
  checkVersionAndUpdateNote();
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
}
