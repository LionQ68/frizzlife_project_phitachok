const ACCOUNT_STATUSES = new Set(['ACTIVE', 'SUSPENDED'])
const DEFAULT_DEMO_PASSWORD = 'Demo1234'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function failure(appState, code, message) {
  return {
    state: appState,
    result: { success: false, code, message },
  }
}

function getNormalizedDeviceIds(appState, assignedDeviceIds) {
  const validDeviceIds = new Set(appState.devices.map(({ id }) => id))

  return [...new Set(assignedDeviceIds ?? [])].filter((id) => validDeviceIds.has(id))
}

function validateAndNormalizeUser(appState, input, excludedUserId = null) {
  const name = String(input?.name ?? '').trim()
  const email = String(input?.email ?? '').trim().toLowerCase()
  const accountStatus = input?.accountStatus ?? 'ACTIVE'

  if (!name) {
    return { error: { code: 'INVALID_USER', message: 'กรุณากรอกชื่อผู้ใช้' } }
  }

  if (!email) {
    return { error: { code: 'INVALID_USER', message: 'กรุณากรอก Email' } }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: { code: 'INVALID_EMAIL', message: 'รูปแบบ Email ไม่ถูกต้อง' } }
  }

  const hasDuplicateEmail = appState.users.some((user) => (
    user.id !== excludedUserId && user.email.toLowerCase() === email
  ))

  if (hasDuplicateEmail) {
    return { error: { code: 'DUPLICATE_EMAIL', message: 'Email นี้มีอยู่ในระบบแล้ว' } }
  }

  if (!ACCOUNT_STATUSES.has(accountStatus)) {
    return { error: { code: 'INVALID_ACCOUNT_STATUS', message: 'สถานะบัญชีไม่ถูกต้อง' } }
  }

  return {
    value: {
      name,
      email,
      accountStatus,
      assignedDeviceIds: getNormalizedDeviceIds(appState, input?.assignedDeviceIds),
    },
  }
}

function assignDevices(devices, userId, assignedDeviceIds) {
  const selectedIds = new Set(assignedDeviceIds)

  return devices.map((device) => {
    if (selectedIds.has(device.id)) {
      return { ...device, assignedUserId: userId }
    }

    if (device.assignedUserId === userId) {
      return { ...device, assignedUserId: null }
    }

    return device
  })
}

function synchronizeAssignedDeviceIds(users, devices) {
  return users.map((user) => ({
    ...user,
    assignedDeviceIds: user.role === 'USER'
      ? devices.filter(({ assignedUserId }) => assignedUserId === user.id).map(({ id }) => id)
      : [],
  }))
}

export function getDeviceAssignmentConflicts(appState, userId, assignedDeviceIds) {
  const selectedIds = new Set(assignedDeviceIds ?? [])

  return appState.devices.filter((device) => (
    selectedIds.has(device.id)
    && device.assignedUserId
    && device.assignedUserId !== userId
  ))
}

export function addUser(appState, input) {
  const validation = validateAndNormalizeUser(appState, input)

  if (validation.error) {
    return failure(appState, validation.error.code, validation.error.message)
  }

  const now = new Date().toISOString()
  const user = {
    id: createMockId('user'),
    name: validation.value.name,
    email: validation.value.email,
    password: DEFAULT_DEMO_PASSWORD,
    role: 'USER',
    accountStatus: validation.value.accountStatus,
    assignedDeviceIds: validation.value.assignedDeviceIds,
    isDemo: true,
    createdAt: now,
  }
  const devices = assignDevices(
    appState.devices,
    user.id,
    validation.value.assignedDeviceIds,
  )
  const users = synchronizeAssignedDeviceIds([...appState.users, user], devices)
  const createdUser = users.find(({ id }) => id === user.id)

  return {
    state: { ...appState, users, devices, updatedAt: now },
    result: {
      success: true,
      code: 'USER_CREATED',
      message: 'เพิ่มผู้ใช้จำลองแล้ว',
      user: createdUser,
    },
  }
}

export function updateUser(appState, userId, changes) {
  const currentUser = appState.users.find(({ id }) => id === userId)

  if (!currentUser || currentUser.role !== 'USER') {
    return failure(appState, 'USER_NOT_FOUND', 'ไม่พบผู้ใช้ที่ต้องการแก้ไข')
  }

  const validation = validateAndNormalizeUser(
    appState,
    { ...currentUser, ...changes },
    userId,
  )

  if (validation.error) {
    return failure(appState, validation.error.code, validation.error.message)
  }

  const now = new Date().toISOString()
  const devices = assignDevices(
    appState.devices,
    userId,
    validation.value.assignedDeviceIds,
  )
  const updatedUsers = appState.users.map((user) => (
    user.id === userId
      ? {
          ...user,
          name: validation.value.name,
          email: validation.value.email,
          accountStatus: validation.value.accountStatus,
        }
      : user
  ))
  const users = synchronizeAssignedDeviceIds(updatedUsers, devices)
  const updatedUser = users.find(({ id }) => id === userId)

  return {
    state: { ...appState, users, devices, updatedAt: now },
    result: {
      success: true,
      code: 'USER_UPDATED',
      message: updatedUser.accountStatus === 'SUSPENDED'
        ? 'บันทึกข้อมูลและระงับบัญชีแล้ว'
        : 'แก้ไขข้อมูลผู้ใช้แล้ว',
      user: updatedUser,
    },
  }
}

