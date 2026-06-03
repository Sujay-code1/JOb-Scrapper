import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authRequested(state) {
      state.status = 'loading'
      state.error = null
    },
    authSucceeded(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.status = 'succeeded'
      state.error = null
    },
    authFailed(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
})

export const { authRequested, authSucceeded, authFailed, logout, clearAuthError } = userSlice.actions
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export default userSlice.reducer
