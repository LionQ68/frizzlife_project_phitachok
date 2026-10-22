import {
  clearSession,
  loadSession,
  saveSession,
} from './storageService.js'

export function getPublicUser(user) {
  const { password: _password, ...publicUser } = user
  return publicUser
}

export function authenticateUser(userList, email, password) {
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail || !password) {
    return {
      success: false,
      code: 'MISSING_CREDENTIALS',
      message: 'กรุณากรอก Email และ Password',
      user: null,
    }
  }

  const matchedUser = userList.find(
    (user) => user.email.toLowerCase() === normalizedEmail,
  )

  if (!matchedUser || matchedUser.password !== password) {
    return {
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Email หรือ Password ไม่ถูกต้อง',
      user: null,
    }
  }

  if (matchedUser.accountStatus === 'SUSPENDED') {
    return {
      success: false,
      code: 'ACCOUNT_SUSPENDED',
      message: 'บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ',
      user: null,
    }
  }

  return {
    success: true,
    code: 'LOGIN_SUCCESS',
    message: 'เข้าสู่ระบบสำเร็จ',
    user: getPublicUser(matchedUser),
  }
}

export function login(userList, credentials, storage) {
  const result = authenticateUser(
    userList,
    credentials?.email,
    credentials?.password,
  )

  if (result.success) {
    saveSession(result.user, storage)
  }

  return result
}

export function logout(storage) {
  clearSession(storage)

  return {
    success: true,
    code: 'LOGOUT_SUCCESS',
    message: 'ออกจากระบบแล้ว',
  }
}

export function restoreSessionUser(userList, storage) {
  const session = loadSession(storage)

  if (!session?.userId) {
    return null
  }

  const matchedUser = userList.find(
    (user) => user.id === session.userId
      && user.role === session.role
      && user.accountStatus !== 'SUSPENDED',
  )

  return matchedUser ? getPublicUser(matchedUser) : null
}

export function getDevicesForUser(appState, user) {
  if (!user) {
    return []
  }


  if (user.accountStatus === 'SUSPENDED') {
    return []
  }

  if (user.role === 'ADMIN') {
    return appState.devices
  }

  const assignedIds = new Set(user.assignedDeviceIds ?? [])
  return appState.devices.filter((device) => assignedIds.has(device.id))
}

export function canUserAccessDevice(user, deviceId) {
  if (!user || !deviceId) {
    return false
  }

  if (user.accountStatus === 'SUSPENDED') {
    return false
  }

  if (user.role === 'ADMIN') {
    return true
  }

  return user.role === 'USER'
    && (user.assignedDeviceIds ?? []).includes(deviceId)
}
