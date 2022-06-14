<script setup>
import { ref } from 'vue'
import { useTempStore } from '../../store/temp'

const test = ref(1)
const temp = useTempStore()
</script>

<template>
  <div>
    Main Screen {{ test }}
    {{ temp.text }}
  </div>
</template>
