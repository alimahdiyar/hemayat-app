import Vue from "nativescript-vue";
import Home from "./pages/Home";
import routes from '~/routes'
import utilsMixin from '~/mixins/utilsMixin'
import { vueConfigScilent } from '~/config'

Vue.mixin(utilsMixin)
Vue.prototype.$routes = routes
Vue.registerElement('MapView', () => require('nativescript-google-maps-sdk').MapView)
Vue.config.silent = (TNS_ENV === 'production') || vueConfigScilent

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }
}).$start();
