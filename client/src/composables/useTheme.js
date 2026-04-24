import { ref, computed } from 'vue'

const currentTheme = ref(localStorage.getItem('app-theme') || 'light')

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : ''
}

applyTheme(currentTheme.value)

export function useTheme() {
  const setTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem('app-theme', theme)
    applyTheme(theme)
  }

  const isDark = computed(() => currentTheme.value === 'dark')

  const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')

  return { currentTheme, isDark, setTheme, toggleTheme }
}
