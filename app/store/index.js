import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import authentication from './modules/authentication'
import database from './modules/database'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    authentication,
    database
  },
  strict: debug
})

Vue.prototype.$store = store

export default store
