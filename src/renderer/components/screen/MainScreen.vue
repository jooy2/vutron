<template>
  <div>
    Main Screen {{ test }}
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const test = ref(1)

    return {
      test
    }
  }
}
</script>
