<script setup>
import HeaderLayout from '@/renderer/components/layout/HeaderLayout'
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
