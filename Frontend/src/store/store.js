import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import jobsReducer from '../features/jobs/jobSlice.js'
import applicationsReducer from '../features/application/applicationSlice.js'
import profileReducer from '../features/profile/profileSlice.js'
import themeReducer from '../features/theme/themeSlice.js'
import notificationsReducer from '../features/notifications/notificationSlice.js'
import { loadAuthState, saveAuthState } from './persist.js'

const reducers = {
  auth: userReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
  profile: profileReducer,
  theme: themeReducer,
  notifications: notificationsReducer,
}

const persistedAuth = loadAuthState()

export const store = configureStore({
  reducer: reducers,
  preloadedState: {
    auth: persistedAuth,
  },
})

store.subscribe(() => {
  saveAuthState(store.getState().auth)
})
