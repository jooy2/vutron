<script setup>
import { DefaultLayout } from '@/renderer/components/layout'
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
  /* Do not force capitalization of button text */
  .v-btn {
    text-transform: unset !important
  }
</style>
