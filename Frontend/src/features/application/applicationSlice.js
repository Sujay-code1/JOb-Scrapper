import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  history: [],
  status: 'idle',
  error: null,
}

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplicationHistory(state, action) {
      state.history = Array.isArray(action.payload) ? action.payload : []
      state.status = 'succeeded'
      state.error = null
    },
    addApplication(state, action) {
      if (!Array.isArray(state.history)) state.history = []
      state.history.unshift(action.payload)
    },
    setApplicationLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setApplicationError(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const {
  setApplicationHistory,
  addApplication,
  setApplicationLoading,
  setApplicationError,
} = applicationSlice.actions
export default applicationSlice.reducer
