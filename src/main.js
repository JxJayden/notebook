import Vue from 'vue';
import App from './App.vue';
import router from './router';
import storage from './utils/storage';

Vue.config.productionTip = false;

const isSupportstorage = storage.isSupport();

if (!isSupportstorage) {
  alert('您的浏览器暂不支持 localStorage，请更换浏览器使用。');
} else {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
}
