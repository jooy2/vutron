<script setup lang="ts">
import HeaderLayout from '@/renderer/components/layout/HeaderLayout.vue'
</script>

<template>
  <v-app>
    <v-layout>
      <HeaderLayout />
      <v-main>
        <slot />
      </v-main>
    </v-layout>
  </v-app>
</template>
