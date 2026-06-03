import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import jobsReducer from '../features/jobs/jobSlice.js'
import applicationsReducer from '../features/application/applicationSlice.js'
import profileReducer from '../features/profile/profileSlice.js'
import { loadAuthState, saveAuthState } from './persist.js'

const reducers = {
  auth: userReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
  profile: profileReducer,
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
