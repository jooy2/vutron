<script setup lang="tsx">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { mdiFitToScreenOutline, mdiHome } from '@mdi/js'

const router = useRouter()
const route: any = useRoute()
const titleKey: string = (route?.meta?.titleKey || 'title.main') as string

const { t } = useI18n()

const handleRoute = (path: string): void => {
  router.push(path)
}

const isCurrentRoute = (path: string): boolean => {
  return path === route.path
}
</script>
<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ t(titleKey) }}</v-app-bar-title>
    <template #append>
      <v-btn
        :prepend-icon="mdiHome"
        variant="text"
        :class="{ active: isCurrentRoute('/') }"
        @click="handleRoute('/')"
      >
        {{ t('title.main') }}
      </v-btn>
      <v-btn
        :prepend-icon="mdiFitToScreenOutline"
        variant="text"
        :class="{ active: isCurrentRoute('/second') }"
        @click="handleRoute('/second')"
      >
        {{ t('title.second') }}
      </v-btn>
    </template>
  </v-app-bar>
</template>
<style scoped>
.v-btn {
  opacity: 0.4;
}
.active {
  opacity: 1 !important;
}
</style>
