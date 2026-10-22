import { getDeviceCapabilities } from '../utils/deviceCapabilities.js'

const SENSOR_TEMPLATES = [
  { key: 'kitchen', name: 'Kitchen Sensor', zone: 'ใต้ซิงก์ครัว' },
  { key: 'bathroom', name: 'Bathroom Sensor', zone: 'ห้องน้ำ' },
  { key: 'utility', name: 'Utility Sensor', zone: 'ห้องซักล้าง' },
]

const DEVICE_STATUSES = new Set(['ONLINE', 'WARNING', 'OFFLINE'])
const REQUIRED_FIELD_LABELS = {
  serialNumber: 'Serial Number',
  name: 'ชื่ออุปกรณ์',
  model: 'รุ่นอุปกรณ์',
  location: 'สถานที่ติดตั้ง',
}

function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function failure(appState, code, message) {
  return {
    state: appState,
    result: { success: false, code, message },
  }
}

function validateAndNormalizeDevice(appState, input, excludedDeviceId = null) {
  const missingField = Object.keys(REQUIRED_FIELD_LABELS).find(
    (field) => !String(input?.[field] ?? '').trim(),
  )

  if (missingField) {
    return {
      error: {
        code: 'INVALID_DEVICE',
        message: `กรุณากรอก ${REQUIRED_FIELD_LABELS[missingField]}`,
      },
    }
  }

  const serialNumber = input.serialNumber.trim()
  const hasDuplicateSerial = appState.devices.some((device) => (
    device.id !== excludedDeviceId
      && device.serialNumber.toLocaleLowerCase() === serialNumber.toLocaleLowerCase()
  ))

  if (hasDuplicateSerial) {
    return {
      error: {
        code: 'DUPLICATE_SERIAL_NUMBER',
        message: 'Serial Number นี้มีอยู่แล้ว',
      },
    }
  }

  let capabilities

  try {
    capabilities = getDeviceCapabilities(input.model)
  } catch {
    return {
      error: {
        code: 'UNSUPPORTED_MODEL',
        message: 'ไม่รองรับรุ่นอุปกรณ์ที่เลือก',
      },
    }
  }

  const status = input.status ?? 'ONLINE'

  if (!DEVICE_STATUSES.has(status)) {
    return {
      error: {
        code: 'INVALID_DEVICE_STATUS',
        message: 'สถานะอุปกรณ์ไม่ถูกต้อง',
      },
    }
  }

  const assignedUser = input.assignedUserId
    ? appState.users.find(
      (user) => user.id === input.assignedUserId && user.role === 'USER',
    )
    : null

  if (input.assignedUserId && !assignedUser) {
    return {
      error: {
        code: 'USER_NOT_FOUND',
        message: 'ไม่พบ User ที่ต้องการผูกกับอุปกรณ์',
      },
    }
  }

  return {
    value: {
      serialNumber,
      name: input.name.trim(),
      model: input.model,
      capabilities,
      assignedUserId: assignedUser?.id ?? null,
      customerName: input.customerName?.trim() || assignedUser?.name || '',
      location: input.location.trim(),
      status,
      protectionEnabled: input.protectionEnabled ?? true,
      firmwareVersion: input.firmwareVersion?.trim() || 'DEMO-1.0.0',
    },
  }
}

function updateAssignedDeviceIds(users, deviceId, previousUserId, nextUserId) {
  return users.map((user) => {
    let assignedDeviceIds = user.assignedDeviceIds ?? []

    if (user.id === previousUserId && previousUserId !== nextUserId) {
      assignedDeviceIds = assignedDeviceIds.filter((id) => id !== deviceId)
    }

    if (user.id === nextUserId && !assignedDeviceIds.includes(deviceId)) {
      assignedDeviceIds = [...assignedDeviceIds, deviceId]
    }

    return { ...user, assignedDeviceIds }
  })
}

function createDefaultSensors(deviceId, recordedAt) {
  return SENSOR_TEMPLATES.map((sensor) => ({
    id: `${deviceId}-sensor-${sensor.key}`,
    deviceId,
    name: sensor.name,
    zone: sensor.zone,
    status: 'NORMAL',
    batteryLevel: 100,
    signalStrength: -50,
    lastSeenAt: recordedAt,
    isMock: true,
  }))
}

function sanitizeTelemetryForModel(telemetry, deviceId, capabilities) {
  return telemetry.map((record) => {
    if (record.deviceId !== deviceId) {
      return record
    }

    const { temperature: _temperature, pressure: _pressure, ...baseRecord } = record

    if (capabilities.temperature) {
      return { ...baseRecord, temperature: record.temperature ?? 27 }
    }

    return { ...baseRecord, pressure: record.pressure ?? 58 }
  })
}

export function addDevice(appState, input) {
  const validation = validateAndNormalizeDevice(appState, input)

  if (validation.error) {
    return failure(appState, validation.error.code, validation.error.message)
  }

  const now = new Date().toISOString()
  const deviceId = createMockId('device')
  const device = {
    id: deviceId,
    ...validation.value,
    packageVariant: '3S',
    valveStatus: 'CLOSED',
    lastSeenAt: now,
    createdAt: now,
    isMock: true,
  }
  const nextState = {
    ...appState,
    devices: [...appState.devices, device],
    leakSensors: [
      ...appState.leakSensors,
      ...createDefaultSensors(deviceId, now),
    ],
    users: updateAssignedDeviceIds(
      appState.users,
      deviceId,
      null,
      device.assignedUserId,
    ),
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'DEVICE_CREATED',
      message: 'เพิ่มอุปกรณ์จำลองแล้ว',
      device,
    },
  }
}

export function updateDevice(appState, deviceId, changes) {
  const currentDevice = appState.devices.find((device) => device.id === deviceId)

  if (!currentDevice) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์ที่ต้องการแก้ไข')
  }

  const nextInput = { ...currentDevice, ...changes }
  const validation = validateAndNormalizeDevice(appState, nextInput, deviceId)

  if (validation.error) {
    return failure(appState, validation.error.code, validation.error.message)
  }

  const now = new Date().toISOString()
  const nextModel = validation.value.model
  const updatedDevice = {
    ...currentDevice,
    ...validation.value,
    id: currentDevice.id,
    packageVariant: '3S',
    isMock: true,
  }
  const nextState = {
    ...appState,
    devices: appState.devices.map((device) => (
      device.id === deviceId ? updatedDevice : device
    )),
    users: updateAssignedDeviceIds(
      appState.users,
      deviceId,
      currentDevice.assignedUserId,
      updatedDevice.assignedUserId,
    ),
    telemetry: nextModel === currentDevice.model
      ? appState.telemetry
      : sanitizeTelemetryForModel(
        appState.telemetry,
        deviceId,
        validation.value.capabilities,
      ),
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'DEVICE_UPDATED',
      message: 'แก้ไขข้อมูลอุปกรณ์แล้ว',
      device: updatedDevice,
    },
  }
}
