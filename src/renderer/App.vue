<script setup lang="tsx">
import { DefaultLayout } from '@/renderer/components/layout'
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style>
html {
  overflow-y: auto !important;
  user-select: none;
}
html,
body {
  width: 100%;
  height: 100%;
}
</style>
