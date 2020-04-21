import Vue from "nativescript-vue";
import { TNSFontIcon, fonticon } from 'nativescript-fonticon'
import Root from "./components/Root";
import routes from '~/router'
import utilsMixin from '~/mixins/utilsMixin'
import { vueConfigScilent, startPage, startPageProps } from '~/config'

import store from '~/store'

const moment = require('jalali-moment')
moment.locale('fa')
Vue.prototype.moment = moment

TNSFontIcon.debug = false
TNSFontIcon.paths = {
  'fa': './assets/css/fontawesome.min.css',
  'far': './assets/css/regular.min.css',
  'fas': './assets/css/solid.min.css',
  'fab': './assets/css/brands.min.css'
}
TNSFontIcon.loadCss()

Vue.filter('fonticon', fonticon)

Vue.mixin(utilsMixin)
Vue.prototype.$routes = routes
Vue.registerElement('MapView', () => require('nativescript-google-maps-sdk').MapView)
Vue.config.silent = (TNS_ENV === 'production') || vueConfigScilent

store.dispatch('initDatabase').then(() => {
  new Vue({
    store,
    render (h) {
      return h(
        Root,
        [
          h(startPage, {
            slot: 'mainContent',
            props: startPageProps
          })
        ]
      )
    }
  }).$start()
});