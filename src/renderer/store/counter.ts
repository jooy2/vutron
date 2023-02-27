import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
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
