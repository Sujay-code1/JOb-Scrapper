import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem('job-scraper-theme')
  return saved === 'dark' || saved === 'light' ? saved : 'light'
}

const initialState = {
  mode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('job-scraper-theme', state.mode)
      }
    },
    setTheme(state, action) {
      state.mode = action.payload === 'dark' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('job-scraper-theme', state.mode)
      }
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
