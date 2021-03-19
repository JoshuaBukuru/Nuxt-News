import { getUserFromCookie, getUserFromLocalStorage } from '~/utils'
export default function({ store, req }) {
  if (process.server && !req) return //if there server is loaded and there is no request,
  //then we going to just return from this function
  const userData = process.server
    ? getUserFromCookie(req)
    : getUserFromLocalStorage()

  if (!userData) {
    return
  } else if (!userData.jwt || Date.now() > userData.expiresIn) {
    store.commit('clearToken')
    store.commit('clearUser')
  } else {
    store.commit('setToken', userData.jwt)
    store.commit('setUser', { email: userData.user, avatar: userData.avatar })
    const timeToLogout = userData.expiresIn - Date.now()
    store.dispatch('setLogoutTimer', timeToLogout)
  }
}
