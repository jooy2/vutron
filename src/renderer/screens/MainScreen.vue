<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { useLocale, useTheme } from 'vuetify'
import {
  getAppVersion,
  getWindowInfo,
  onWindowsUpdated,
  openExternal,
  openFile,
  openWindow
} from '@/renderer/utils'
import { useCounterStore } from '@/renderer/store/counter'
import { onMounted, onUnmounted, ref } from 'vue'
import {
  mdiBrightness6,
  mdiDockWindow,
  mdiFileDocument,
  mdiFolderOpen,
  mdiGithub,
  mdiPlusCircle
} from '@mdi/js'
import { storeToRefs } from 'pinia'

const { t, locale, availableLocales } = useI18n()
const { increaseCount } = useCounterStore()
const { count } = storeToRefs(useCounterStore())
const theme = useTheme()
const vuetifyLocale = useLocale()
const languages = ref(['en'])
const appVersion = ref('Unknown')
const selectedFile = ref('')
const childWindowCount = ref(0)
// The listener lives in the main process, so it has to be dropped by hand when
// this screen goes away
let unsubscribeWindowsUpdated: (() => void) | null = null

const getApplicationVersionFromMainProcess = (): void => {
  getAppVersion().then((result: string) => {
    appVersion.value = result
  })
}

const handleChangeTheme = (): void => {
  theme.change(theme.global.current.value.dark ? 'light' : 'dark')
}

const handleChangeLanguage = (val: string): void => {
  locale.value = val
  // Vuetify keeps a separate locale for its built-in component strings, so it
  // has to be switched together with `vue-i18n`.
  vuetifyLocale.current.value = val
}

const handleOpenDocument = (): void => {
  openExternal('https://vutron.cdget.com')
}

const handleOpenGitHub = (): void => {
  openExternal('https://github.com/jooy2/vutron')
}

const handleCountIncrease = (): void => {
  increaseCount(1)
}

const handleOpenFile = async () => {
  const dialogResult = await openFile('text')
  if (!dialogResult.canceled) {
    selectedFile.value = dialogResult.filePaths[0]
  }
}

// Opens the second screen in its own window. The main process answers with
// `null` when multi window is disabled or the window limit is reached.
const handleOpenWindow = async (): Promise<void> => {
  await openWindow('/second')
}

const watchChildWindows = async (): Promise<void> => {
  const windowInfo = await getWindowInfo()

  childWindowCount.value = windowInfo.childWindowIds.length

  unsubscribeWindowsUpdated = onWindowsUpdated((childWindowIds): void => {
    childWindowCount.value = childWindowIds.length
  })
}

onMounted((): void => {
  languages.value = availableLocales

  // Get application version from package.json version string (Using IPC communication)
  getApplicationVersionFromMainProcess()

  // Keep the badge in sync with the windows the main process has open
  watchChildWindows()
})

onUnmounted((): void => {
  unsubscribeWindowsUpdated?.()
})
</script>

<template>
  <v-container>
    <v-row
      no-gutters
      class="text-center align-center"
    >
      <v-col
        cols="12"
        md="5"
      >
        <v-img
          data-testid="main-logo"
          alt="logo"
          draggable="false"
          class="ma-auto h-auto w-sm-50 w-md-100"
          src="images/vutron-logo.webp"
        />
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
        <h2 class="my-4">
          {{ t('desc.welcome-title') }}
        </h2>
        <p>{{ t('desc.welcome-desc') }}</p>
        <p class="my-4">
          App Version: <strong>{{ appVersion }}</strong>
        </p>
        <p v-if="selectedFile">
          {{
            t('desc.selected-file', {
              filePath: selectedFile
            })
          }}
        </p>
        <v-row class="my-4">
          <v-col>
            <v-btn
              icon
              color="primary"
              @click="handleChangeTheme"
            >
              <v-icon :icon="mdiBrightness6" />
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                {{ t('menu.change-theme') }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col>
            <v-badge
              data-testid="counter-badge"
              color="blue"
              :content="count"
            >
              <v-btn
                data-testid="btn-counter"
                icon
                color="primary"
                @click="handleCountIncrease"
              >
                <v-icon :icon="mdiPlusCircle" />
                <v-tooltip
                  activator="parent"
                  location="bottom"
                >
                  {{ t('menu.increase-count') }}
                </v-tooltip>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col>
            <v-btn
              icon
              color="primary"
              @click="handleOpenDocument"
            >
              <v-icon :icon="mdiFileDocument" />
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                {{ t('menu.documentation') }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              icon
              color="primary"
              @click="handleOpenGitHub"
            >
              <v-icon :icon="mdiGithub" />
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                {{ t('menu.github') }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col>
            <v-badge
              data-testid="window-badge"
              color="blue"
              :content="childWindowCount"
            >
              <v-btn
                data-testid="btn-open-window"
                icon
                color="primary"
                @click="handleOpenWindow"
              >
                <v-icon :icon="mdiDockWindow" />
                <v-tooltip
                  activator="parent"
                  location="bottom"
                >
                  {{ t('menu.open-window') }}
                </v-tooltip>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col>
            <v-btn
              icon
              color="primary"
              @click="handleOpenFile"
            >
              <v-icon :icon="mdiFolderOpen" />
              <v-tooltip
                activator="parent"
                location="bottom"
              >
                {{ t('menu.open-file') }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-select
              data-testid="select-language"
              :model-value="locale"
              density="compact"
              :label="t('menu.change-language')"
              :items="languages"
              @update:model-value="handleChangeLanguage"
            >
              {{ t('menu.change-language') }}
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
