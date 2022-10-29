import { defineStore } from 'pinia'

export const useTempStore = defineStore('temp', {
	state: () => ({
		counter: 0
	}),
	getters: {
		getCounter: (state): number => state.counter
	},
	actions: {
		counterIncrease(amount: number) {
			this.counter += amount
		}
	}
})
