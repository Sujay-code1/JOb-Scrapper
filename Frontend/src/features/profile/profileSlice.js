import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload
      state.status = 'succeeded'
      state.error = null
    },
    clearProfile(state) {
      state.profile = null
      state.status = 'idle'
    },
    setProfileLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setProfileError(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
  },
})

export const { setProfile, clearProfile, setProfileLoading, setProfileError } = profileSlice.actions
export default profileSlice.reducer
