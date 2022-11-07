<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { openExternal } from '@/renderer/utils'
import { useTempStore } from '@/renderer/store/temp'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { locale, availableLocales } = useI18n()
const theme = useTheme()
const { counterIncrease } = useTempStore()
const { counter } = storeToRefs(useTempStore())
const languages = ref(['en'])

languages.value = availableLocales

const handleChangeTheme = (): void => {
	theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleChangeLanguage = (val): void => {
	locale.value = val
}

const handleDocument = async (): Promise<void> => {
	await openExternal('https://vutron.jooy2.com')
}

const handleGitHub = async (): Promise<void> => {
	await openExternal('https://github.com/jooy2/vutron')
}

const handleCountIncrease = (): void => {
	counterIncrease(1)
}
</script>

<template>
	<v-container>
		<v-row no-gutters align="center" class="text-center">
			<v-col cols="12" md="5">
				<img
					alt="logo"
					draggable="false"
					class="ma-auto h-auto w-75"
					src="/images/vutron-logo.webp"
				/>
			</v-col>
			<v-col cols="12" md="7">
				<h2 class="my-4">{{ $t('desc.welcome-title') }}</h2>
				<p>{{ $t('desc.welcome-desc') }}</p>
				<v-row class="my-4">
					<v-col cols="3">
						<v-btn icon color="primary" @click="handleChangeTheme">
							<v-icon icon="mdi-brightness-6" />
							<v-tooltip activator="parent" location="bottom">
								{{ $t('menu.change-theme') }}
							</v-tooltip>
						</v-btn>
					</v-col>
					<v-col cols="3">
						<v-badge color="blue" :content="counter">
							<v-btn icon color="primary" @click="handleCountIncrease">
								<v-icon icon="mdi-plus-circle" />
								<v-tooltip activator="parent" location="bottom">
									{{ $t('menu.increase-count') }}
								</v-tooltip>
							</v-btn>
						</v-badge>
					</v-col>
					<v-col cols="3">
						<v-btn icon color="primary" @click="handleDocument">
							<v-icon icon="mdi-file-document" />
							<v-tooltip activator="parent" location="bottom">
								{{ $t('menu.documentation') }}
							</v-tooltip>
						</v-btn>
					</v-col>
					<v-col cols="3">
						<v-btn icon color="primary" @click="handleGitHub">
							<v-icon icon="mdi-github" />
							<v-tooltip activator="parent" location="bottom">
								{{ $t('menu.github') }}
							</v-tooltip>
						</v-btn>
					</v-col>
					<v-col cols="12">
						<v-select
							:model-value="locale"
							density="compact"
							:label="$t('menu.change-language')"
							:items="languages"
							@update:model-value="handleChangeLanguage"
						>
							{{ $t('menu.change-language') }}
						</v-select>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>
