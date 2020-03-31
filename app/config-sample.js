/* eslint-disable no-undef */
const vueConfigScilent = false
const debugHostUrl = 'http://hemayat.15110.ir'
const hostUrl = (TNS_ENV === 'production') ? 'http://hemayat.15110.ir' : debugHostUrl;

export {
  hostUrl,
  vueConfigScilent,
}