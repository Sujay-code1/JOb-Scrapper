import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  results: [],
  status: 'idle',
  error: null,
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setResults(state, action) {
      state.results = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    clearResults(state) {
      state.results = []
      state.status = 'idle'
    },
    setJobLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setJobError(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setResults, clearResults, setJobLoading, setJobError } = jobSlice.actions
export default jobSlice.reducer
