import Vue from "nativescript-vue";
import Root from "./components/Root";
import routes from '~/router'
import utilsMixin from '~/mixins/utilsMixin'
import { vueConfigScilent } from '~/config'

import store from '~/store'

Vue.mixin(utilsMixin)
Vue.prototype.$routes = routes
Vue.registerElement('MapView', () => require('nativescript-google-maps-sdk').MapView)
Vue.config.silent = (TNS_ENV === 'production') || vueConfigScilent

store.dispatch('initDatabase').then(() => {
  new Vue({
    store,
    render (h) {
      return h(
        Root
      )
    }
  }).$start()
});