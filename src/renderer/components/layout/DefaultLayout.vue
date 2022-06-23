<script setup>
import HeaderLayout from './HeaderLayout'
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
