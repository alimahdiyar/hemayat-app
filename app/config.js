/* eslint-disable no-undef */
const vueConfigScilent = false
const appToken = '23c3904f87018e0d27d13ec94fa84e3524fadad6'
const debugHostUrl = 'http://10.0.2.2:8000'


const hostUrl = (TNS_ENV === 'production') ? 'http://hemayat.15110.ir' : debugHostUrl;

export {
  hostUrl,
  vueConfigScilent,
  appToken
}