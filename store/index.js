import Vuex from 'vuex'
import db from '~/plugins/firestore'
import md5 from 'md5'
import { saveUserData, clearUserData } from '~/utils'
const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      category: '',
      loading: false,
      country: 'za',
      token: '',
      user: null
    },

    mutations: {
      setHeadlines(state, headlines) {
        state.headlines = headlines
      },
      setCategory(state, category) {
        state.category = category
      },
      setLoading(state, loading) {
        state.loading = loading
      },
      setCountry(state, country) {
        state.country = country
      },
      setToken(state, token) {
        state.token = token
      },
      setUser(state, user) {
        state.user = user
      },
      clearToken(state) {
        state.token = ''
      },
      clearUser(state) {
        state.user = null
      }
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUrl)
        commit('setLoading', false)
        commit('setHeadlines', articles) //passing a payload articles
      },
      async authenticateUser({ commit }, userPayload) {
        try {
          commit('setLoading', true)
          const authUserData = await this.$axios.$post(
            `/${userPayload.action}/`,
            {
              email: userPayload.email,
              password: userPayload.password,
              returnSecureToken: userPayload.returnSecureToken
            }
          )
          let user
          if (userPayload.action === 'register') {
            const avatar = `http://gravatar.com/avatar/${md5(
              authUserData.email
            )}?d=identicon`
            user = { email: authUserData.email, avatar }
            await db
              .collection('users')
              .doc(userPayload.email)
              .set(user) //user created in firestore, with a key of their email
          } else {
            const loginRef = db.collection('users').doc(userPayload.email)
            const loggedInUser = await loginRef.get()
            user = loggedInUser.data()
          }
          commit('setUser', user)
          commit('setToken', authUserData.idToken)
          commit('setLoading', false)
          saveUserData(authUserData, user)
        } catch (error) {
          console.error(error)
          commit('setLoading', false)
        }
      },
      setLogoutTimer({ dispatch }, interval) {
        setTimeout(() => dispatch('logoutUser'), interval)
      },
      logoutUser({ commit }) {
        commit('clearToken')
        commit('clearUser')
        clearUserData()
      }
    },
    getters: {
      //Allows us to pass state into any component that want to access it
      headlines(state) {
        return state.headlines
      },
      category(state) {
        return state.category
      },
      loading(state) {
        return state.loading
      },
      country(state) {
        return state.country
      },
      isAuthenticated(state) {
        return !!state.token //Convert token into a boolean
      },
      user(state) {
        return state.user
      }
    }
  })
}

export default createStore
