import Vue from 'vue'
import App from './App'
import WXrequest from './utils/wx-request';
import moment from 'moment';

Vue.prototype.$wxhttp = WXrequest
Vue.prototype.$moment = moment;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
