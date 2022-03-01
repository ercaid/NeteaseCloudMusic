import App from './App'
import store from 'store/index.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})

// 全局过滤器
Vue.filter('formatCount', value => {
	if (value >= 10000 && value <= 100000000) {
		value /= 1000
		return value.toFixed(1) + '万'
	} else if (value > 10000000) {
		value /= 100000000;
		return value.toFixed(1) + '亿'
	} else {
		return value
	}
})

// 全局音频上下文
Vue.prototype.$innerAudio = uni.createInnerAudioContext()

app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
