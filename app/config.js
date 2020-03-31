/* eslint-disable no-undef */
const vueConfigScilent = false
const debugHostUrl = 'http://10.0.2.2'


const hostUrl = (TNS_ENV === 'production') ? 'http://hemayat.15110.ir' : debugHostUrl;

export {
  hostUrl,
  vueConfigScilent,
}