import { defineStore } from 'pinia'

export const useTempStore = defineStore('temp', {
  state: () => ({
    text: 'Sample Text'
  }),
  getters: {
    getText: (state) => state.text
  },
  actions: {
    setText(text) {
      this.text = text
    }
  }
})
