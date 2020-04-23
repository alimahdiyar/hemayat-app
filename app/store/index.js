import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import authentication from './modules/authentication'
import database from './modules/database'
import noteTypes from './modules/noteTypes'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    authentication,
    database,
    noteTypes
  },
  strict: debug
})

Vue.prototype.$store = store

export default store
