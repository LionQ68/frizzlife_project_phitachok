function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function failure(appState, code, message) {
  return {
    state: appState,
    result: { success: false, code, message },
  }
}

function isAlertTypeSupported(device, type) {
  if (type === 'TEMPERATURE') {
    return device.capabilities.temperature
  }

  if (type === 'PRESSURE') {
    return device.capabilities.pressure
  }

  return true
}

export function createAlert(appState, input) {
  const device = appState.devices.find(({ id }) => id === input.deviceId)

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์ของ Alert')
  }

  if (!isAlertTypeSupported(device, input.type)) {
    return failure(
      appState,
      'UNSUPPORTED_ALERT_TYPE',
      `อุปกรณ์รุ่น ${device.model} ไม่รองรับ Alert ประเภทนี้`,
    )
  }

  if (
    input.sensorId
    && !appState.leakSensors.some(
      (sensor) => sensor.id === input.sensorId && sensor.deviceId === device.id,
    )
  ) {
    return failure(appState, 'SENSOR_NOT_FOUND', 'ไม่พบ Sensor ของ Alert')
  }

  const now = new Date().toISOString()
  const alert = {
    id: createMockId('alert'),
    deviceId: device.id,
    sensorId: input.sensorId ?? null,
    type: input.type,
    severity: input.severity,
    status: 'OPEN',
    title: input.title,
    message: input.message,
    createdAt: now,
    resolvedAt: null,
    isMock: true,
  }
  const nextState = {
    ...appState,
    alerts: [alert, ...appState.alerts],
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'ALERT_CREATED',
      message: 'สร้าง Alert จำลองแล้ว',
      alert,
    },
  }
}

export function acknowledgeAlert(appState, alertId, userId) {
  const alert = appState.alerts.find(({ id }) => id === alertId)

  if (!alert) {
    return failure(appState, 'ALERT_NOT_FOUND', 'ไม่พบ Alert ที่ต้องการรับทราบ')
  }

  if (alert.status !== 'OPEN') {
    return failure(
      appState,
      'INVALID_ALERT_STATUS',
      'รับทราบได้เฉพาะ Alert ที่มีสถานะ Open',
    )
  }

  const now = new Date().toISOString()
  const nextState = {
    ...appState,
    alerts: appState.alerts.map((item) => (
      item.id === alertId
        ? {
          ...item,
          status: 'ACKNOWLEDGED',
          acknowledgedAt: now,
          acknowledgedBy: userId,
        }
        : item
    )),
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'ALERT_ACKNOWLEDGED',
      message: 'รับทราบ Alert แล้ว',
    },
  }
}

export function resolveAlert(appState, alertId, userId, resolutionNote) {
  const alert = appState.alerts.find(({ id }) => id === alertId)

  if (!alert) {
    return failure(appState, 'ALERT_NOT_FOUND', 'ไม่พบ Alert ที่ต้องการปิด')
  }

  if (alert.status !== 'ACKNOWLEDGED') {
    return failure(
      appState,
      'INVALID_ALERT_STATUS',
      'ต้องรับทราบ Alert ก่อนเปลี่ยนเป็น Resolved',
    )
  }

  if (!resolutionNote?.trim()) {
    return failure(appState, 'RESOLUTION_REQUIRED', 'กรุณาระบุรายละเอียดการแก้ไข')
  }

  const now = new Date().toISOString()
  const nextState = {
    ...appState,
    alerts: appState.alerts.map((item) => (
      item.id === alertId
        ? {
          ...item,
          status: 'RESOLVED',
          resolvedAt: now,
          resolvedBy: userId,
          resolutionNote: resolutionNote.trim(),
        }
        : item
    )),
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'ALERT_RESOLVED',
      message: 'ปิด Alert แล้ว โดยสถานะวาล์วไม่เปลี่ยนแปลง',
    },
  }
}

export function hasActiveCriticalAlert(appState, deviceId) {
  return appState.alerts.some(
    (alert) => alert.deviceId === deviceId
      && alert.severity === 'CRITICAL'
      && alert.status !== 'RESOLVED',
  )
}
