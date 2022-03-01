import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		listIds: [],
		nextId: ''
	},
	mutations: {
		INIT_IDS(state, payload) {
			state.listIds = payload
		},
		NEXT_ID(state, payload) {
			for (let i = 0; i < state.listIds.length; i++) {
				// 如果是最后一项，返回第一个id
				if (state.listIds[state.listIds.length - 1].id === payload) {
					state.nextId = state.listIds[0].id
					break
				}
				if (state.listIds[i].id === payload) {
					state.nextId = state.listIds[i + 1].id
					break
				}
			}
		}
	}
})
