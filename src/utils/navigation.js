export const ROLE_HOME_PATHS = Object.freeze({
  ADMIN: '/admin/dashboard',
  USER: '/user/dashboard',
})

export function getHomePathForRole(role) {
  return ROLE_HOME_PATHS[role] ?? '/login'
}
