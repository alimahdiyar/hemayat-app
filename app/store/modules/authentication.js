const state = {
  userToken: null,
}

const getters = {
  isAuthenticated: state => {
    return state.userToken !== null
  },
  userToken: state => {
    return state.userToken
  },
}

const mutations = {
  updateUserToken (state, newToken) {
    state.userToken = newToken
  },
  logout (state) {
    state.userToken = null
  }
}

const actions = {
  saveUserToken ({ getters, commit }, userToken) {
    return new Promise((resolve, reject) => {
      getters.database.execSQL('UPDATE user_data SET user_token = ?', [userToken]).then(() => {
        commit('updateUserToken', userToken)
        resolve()
      }, error => {
        console.log('EXEC SQL ERROR ', error)
        reject(error)
      })
    })
  },
  logout ({ getters, commit }) {
    return new Promise((resolve, reject) => {
      getters.database.execSQL('UPDATE user_data SET user_token = NULL', []).then(id => {
        commit('logout')
        resolve()
      }, error => {
        console.log('EXEC SQL ERROR ', error)
        reject(error)
      })
    })
  }
}

// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
