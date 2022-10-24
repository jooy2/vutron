<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { openExternal } from '@/renderer/utils'
import { useTempStore } from '@/renderer/store/temp'
import { storeToRefs } from 'pinia'

const { locale } = useI18n()
const theme = useTheme()
const { counterIncrease } = useTempStore()
const { counter } = storeToRefs(useTempStore())

const handleChangeTheme = (): void => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleChangeLanguage = (): void => {
  if (locale.value === 'en') {
    locale.value = 'ko'
  } else {
    locale.value = 'en'
  }
}

const handleAbout = async (): Promise<void> => {
  await openExternal('https://github.com/jooy2/vutron')
}

const handleCountIncrease = (): void => {
  counterIncrease(1)
}
</script>

<template>
  <v-container>
    <v-row align="center" class="text-center">
      <v-col cols="12">
        <img alt="logo" class="ma-auto h-auto w-75" src="/images/vutron-logo.webp" />
      </v-col>
      <v-col cols="12">
        {{ $t('desc.welcome') }}
      </v-col>
      <v-col cols="12"> Counter: {{ counter }} </v-col>
      <v-col cols="3">
        <v-btn block color="primary" @click="handleChangeTheme">
          {{ $t('menu.change-theme') }}
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn block color="primary" @click="handleChangeLanguage">
          {{ $t('menu.change-language') }}
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn block color="primary" @click="handleAbout">
          {{ $t('menu.about') }}
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn block color="primary" @click="handleCountIncrease">Count + 1</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
