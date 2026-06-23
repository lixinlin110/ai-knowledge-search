import App from './App.vue'
import {
  ElAlert,
  ElAside,
  ElButton,
  ElContainer,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElRadioButton,
  ElRadioGroup,
  ElSkeleton,
  ElStep,
  ElSteps,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
const elementPlusComponents = [
  ElAlert,
  ElAside,
  ElButton,
  ElContainer,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElRadioButton,
  ElRadioGroup,
  ElSkeleton,
  ElStep,
  ElSteps,
  ElTable,
  ElTableColumn,
  ElTag,
]

elementPlusComponents.forEach((component) => app.use(component))

app.use(pinia)
app.use(router)

useThemeStore().applyTheme()

app.mount('#app')
