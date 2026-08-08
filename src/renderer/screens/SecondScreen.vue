<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { closeCurrentWindow, getWindowInfo } from '@/renderer/utils'
import { onMounted, ref } from 'vue'
import { mdiCloseBoxOutline, mdiEmoticonCoolOutline } from '@mdi/js'

const { t } = useI18n()
// The same screen is used by the main window and by windows opened on top of
// it, so what it may do is asked of the main process instead of assumed.
const isChildWindow = ref(false)

const handleCloseWindow = async (): Promise<void> => {
  await closeCurrentWindow()
}

onMounted(async (): Promise<void> => {
  isChildWindow.value = (await getWindowInfo()).isChildWindow
})
</script>

<template>
  <v-container>
    <v-row
      no-gutters
      class="text-center"
    >
      <v-col cols="12">
        <v-icon
          :icon="mdiEmoticonCoolOutline"
          size="250"
          color="#009f57"
        />
      </v-col>
      <v-col
        cols="12"
        class="my-4"
      >
        {{ t('desc.second-desc') }}
      </v-col>
      <v-col
        v-if="isChildWindow"
        cols="12"
      >
        <p class="mb-4">
          {{ t('desc.child-window-desc') }}
        </p>
        <v-btn
          data-testid="btn-close-window"
          color="primary"
          :prepend-icon="mdiCloseBoxOutline"
          @click="handleCloseWindow"
        >
          {{ t('menu.close-window') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
