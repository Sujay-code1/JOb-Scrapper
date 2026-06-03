export const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('job-scraper-auth')
    if (!serialized) return undefined

    const state = JSON.parse(serialized)
    return {
      ...state,
      isAuthenticated: Boolean(state?.token),
    }
  } catch {
    return undefined
  }
}

export const saveAuthState = (authState) => {
  try {
    const serialized = JSON.stringify({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
    })
    localStorage.setItem('job-scraper-auth', serialized)
  } catch {
    // ignore write errors
  }
}
