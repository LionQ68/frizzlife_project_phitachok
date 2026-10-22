import { hasActiveCriticalAlert } from './alertService.js'
import { canUserAccessDevice } from './authService.js'

function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createValveCommand(deviceId, input, status, now) {
  return {
    id: createMockId('valve-command'),
    deviceId,
    command: input.command,
    source: input.source ?? 'USER',
    status,
    requestedBy: input.requestedBy ?? 'SYSTEM',
    reason: input.reason?.trim() || 'คำสั่งวาล์วสำหรับการสาธิต',
    createdAt: now,
    completedAt: now,
    isMock: true,
  }
}

export function canOpenValve(appState, deviceId) {
  return getValveCommandAvailability(appState, deviceId, 'OPEN')
}

export function getValveCommandAvailability(appState, deviceId, command) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return {
      allowed: false,
      code: 'DEVICE_NOT_FOUND',
      message: 'ไม่พบอุปกรณ์ที่ต้องการควบคุม',
    }
  }

  if (!['OPEN', 'CLOSE'].includes(command)) {
    return {
      allowed: false,
      code: 'INVALID_VALVE_COMMAND',
      message: 'คำสั่งวาล์วไม่ถูกต้อง',
    }
  }

  if (!device.capabilities.valveControl) {
    return {
      allowed: false,
      code: 'VALVE_CONTROL_UNSUPPORTED',
      message: `อุปกรณ์รุ่น ${device.model} ไม่รองรับการควบคุมวาล์ว`,
    }
  }

  if (device.status === 'OFFLINE') {
    return {
      allowed: false,
      code: 'DEVICE_OFFLINE',
      message: 'ไม่สามารถส่งคำสั่งได้ขณะอุปกรณ์ Offline',
    }
  }

  const targetStatus = command === 'OPEN' ? 'OPEN' : 'CLOSED'

  if (device.valveStatus === targetStatus) {
    return {
      allowed: false,
      code: command === 'OPEN' ? 'VALVE_ALREADY_OPEN' : 'VALVE_ALREADY_CLOSED',
      message: command === 'OPEN' ? 'วาล์วเปิดอยู่แล้ว' : 'วาล์วปิดอยู่แล้ว',
    }
  }

  if (command === 'CLOSE') {
    return {
      allowed: true,
      code: 'VALVE_CAN_CLOSE',
      message: 'สามารถปิดวาล์วได้',
    }
  }

  const hasActiveLeak = appState.leakSensors.some(
    (sensor) => sensor.deviceId === deviceId && sensor.status === 'LEAK',
  )

  if (hasActiveLeak) {
    return {
      allowed: false,
      code: 'ACTIVE_LEAK',
      message: 'ไม่สามารถเปิดวาล์วได้ขณะที่ Leak Sensor ยังตรวจพบน้ำ',
    }
  }

  if (hasActiveCriticalAlert(appState, deviceId)) {
    return {
      allowed: false,
      code: 'ACTIVE_CRITICAL_ALERT',
      message: 'ไม่สามารถเปิดวาล์วได้ขณะมี Critical Alert ที่ยังไม่ Resolved',
    }
  }

  return {
    allowed: true,
    code: 'VALVE_CAN_OPEN',
    message: 'สามารถเปิดวาล์วได้',
  }
}

export function requestValveCommand(appState, deviceId, input) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return {
      state: appState,
      result: {
        success: false,
        code: 'DEVICE_NOT_FOUND',
        message: 'ไม่พบอุปกรณ์ที่ต้องการควบคุม',
      },
    }
  }

  if (!['OPEN', 'CLOSE'].includes(input.command)) {
    return {
      state: appState,
      result: {
        success: false,
        code: 'INVALID_VALVE_COMMAND',
        message: 'คำสั่งวาล์วไม่ถูกต้อง',
      },
    }
  }

  const now = new Date().toISOString()
  const permission = getValveCommandAvailability(
    appState,
    deviceId,
    input.command,
  )
  const commandStatus = permission.allowed ? 'SUCCESS' : 'FAILED'
  const command = createValveCommand(deviceId, input, commandStatus, now)
  const nextState = {
    ...appState,
    devices: permission.allowed
      ? appState.devices.map((item) => (
        item.id === deviceId
          ? {
            ...item,
            valveStatus: input.command === 'OPEN' ? 'OPEN' : 'CLOSED',
          }
          : item
      ))
      : appState.devices,
    valveCommands: [command, ...appState.valveCommands],
    updatedAt: now,
  }

  if (!permission.allowed) {
    return {
      state: nextState,
      result: {
        success: false,
        code: permission.code,
        message: permission.message,
        command,
      },
    }
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'VALVE_COMMAND_SUCCESS',
      message: input.command === 'OPEN' ? 'เปิดวาล์วแล้ว' : 'ปิดวาล์วแล้ว',
      command,
    },
  }
}

export function requestAuthorizedValveCommand(appState, deviceId, input, user) {
  if (!canUserAccessDevice(user, deviceId)) {
    return {
      state: appState,
      result: {
        success: false,
        code: 'DEVICE_ACCESS_DENIED',
        message: 'บัญชีนี้ไม่มีสิทธิ์ควบคุมอุปกรณ์ดังกล่าว',
      },
    }
  }

  return requestValveCommand(appState, deviceId, {
    ...input,
    source: 'USER',
    requestedBy: user.id,
  })
}
