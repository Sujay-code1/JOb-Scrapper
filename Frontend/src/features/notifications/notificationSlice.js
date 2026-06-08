import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showToast(state, action) {
      state.items.push({
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        message: action.payload.message || 'Done',
      })
    },
    dismissToast(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { showToast, dismissToast } = notificationSlice.actions
export default notificationSlice.reducer
