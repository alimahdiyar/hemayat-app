/* eslint-disable no-undef */
import routes from '~/router'

const vueConfigScilent = false
const debugHostUrl = 'http://hemayat.15110.ir'

const debugStartPage = routes.Home
const debugStartPageProps = {}

const hostUrl = (TNS_ENV === 'production') ? 'http://hemayat.15110.ir' : debugHostUrl;
const startPage = (TNS_ENV === 'production') ? routes.Home : debugStartPage
const startPageProps = (TNS_ENV === 'production') ? {} : debugStartPageProps
export {
  hostUrl,
  vueConfigScilent,
  startPage,
  startPageProps
}