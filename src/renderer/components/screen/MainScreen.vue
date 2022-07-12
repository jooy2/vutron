<script setup>
// import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import Utils from '../../assets/js/utils'

// const { locale } = useI18n()
const theme = useTheme()

const handleChangeTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleChangeLanguage = () => {
  // locale.value = 'en' // TODO
}

const handleAbout = async () => {
  await Utils.openExternal('https://github.com/jooy2/vutron')
}
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
      <v-col cols="4">
        <v-btn
          block
          color="primary"
          @click="handleChangeTheme"
        >
          {{ $t('menu.change-theme') }}
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          disabled
          color="primary"
          @click="handleChangeLanguage"
        >
          {{ $t('menu.change-language') }}
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          color="primary"
          @click="handleAbout"
        >
          {{ $t('menu.about') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
