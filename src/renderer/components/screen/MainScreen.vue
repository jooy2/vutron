<script setup>
</script>

<template>
  <v-container>
    <v-row
      align="center"
      class="text-center"
    >
      <v-col cols="12">
        <img
          alt="logo"
          class="ma-auto h-auto w-75"
          src="~@/assets/img/vutron-logo.png"
        >
      </v-col>
      <v-col cols="12">
        {{ $t('desc.welcome') }}
      </v-col>
    </v-row>
  </v-container>
</template>
