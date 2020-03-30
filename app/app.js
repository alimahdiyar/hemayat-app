import Vue from "nativescript-vue";
import { vueConfigScilent } from '~/config'

import Home from "./pages/Home";
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
