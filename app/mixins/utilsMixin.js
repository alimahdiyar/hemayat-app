/* eslint-disable no-undef */
import { hostUrl } from '~/config'
import NetworkFailure from '~/components/NetworkFailure'

export default {
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
  }
}
