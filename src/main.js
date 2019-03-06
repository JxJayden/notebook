import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import stroge from './utils/stroge';

Vue.config.productionTip = false;

const isSupportStroge = stroge.isSupport();

if (!isSupportStroge) {
  alert('您的浏览器暂不支持 localStroge，请更换浏览器使用。');
} else {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}
