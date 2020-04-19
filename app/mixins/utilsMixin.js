/* eslint-disable no-undef */
import { hostUrl } from '~/config'
import NetworkFailure from '~/components/NetworkFailure'

export default {
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
  },
  data () {
    return {
      hostUrl,
      networkFailureRetryObject: null
    }
  },
  components: {
    NetworkFailure
  },
  methods: {
    networkFailureRetry () {
      Reflect.apply(this.networkFailureRetryObject.func, this, this.networkFailureRetryObject.args)
      this.networkFailureRetryObject = null
    },
    onNetworkFailure ({ func, args }) {
      this.networkFailureRetryObject = {
        func,
        args
      }
    },
    toEnglishNumber (str) {
      return str.replace(new RegExp('۰', 'g'), '0')
        .replace(new RegExp('۱', 'g'), '1')
        .replace(new RegExp('۲', 'g'), '2')
        .replace(new RegExp('۳', 'g'), '3')
        .replace(new RegExp('۴', 'g'), '4')
        .replace(new RegExp('۵', 'g'), '5')
        .replace(new RegExp('۶', 'g'), '6')
        .replace(new RegExp('۷', 'g'), '7')
        .replace(new RegExp('۸', 'g'), '8')
        .replace(new RegExp('۹', 'g'), '9')
        .replace(new RegExp('٪', 'g'), '%')
    },
  }
}
