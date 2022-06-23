<script setup>
import { DefaultLayout } from './components/layout'
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
  html {
    overflow-y: auto !important
  }
  html, body {
    width: 100%;
    height: 100%
  }
</style>
