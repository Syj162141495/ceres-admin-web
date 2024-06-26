import Cookies from 'js-cookie'

const TokenKey = 'cereShopAdminToken'
const roleName = 'roleName'
const platformUser = 'platformUserId'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getUserId() {
  return localStorage.getItem(platformUser)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setName(name) {
  return localStorage.setItem(roleName, name)
}
export function setUserId(platformUserId) {
  return localStorage.setItem(platformUser, platformUserId)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
