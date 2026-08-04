<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { mdiAlertCircleOutline } from '@mdi/js'

const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-row
      no-gutters
      class="text-center"
    >
      <v-col cols="12">
        <v-icon
          :icon="mdiAlertCircleOutline"
          size="150"
          color="error"
        />
      </v-col>
      <v-col
        cols="12"
        class="my-4"
      >
        <h2>{{ t('title.error') }}</h2>
        <p class="my-2">
          {{ t('desc.error-desc') }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
