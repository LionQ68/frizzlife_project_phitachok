import {
  acknowledgeAlert,
  createAlert,
  resolveAlert,
} from './alertService.js'
import { requestValveCommand } from './valveService.js'
import {
  createNextTelemetryValues,
  getLatestDeviceTelemetry,
} from '../utils/simulatorSelectors.js'

const MAX_TELEMETRY_PER_DEVICE = 30 * 24
const MAX_EVENT_LOG_ENTRIES = 100

function createMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function failure(appState, code, message) {
  return {
    state: appState,
    result: { success: false, code, message },
  }
}

function addEvent(appState, event) {
  const now = new Date().toISOString()

  return {
    ...appState,
    eventLog: [
      {
        id: createMockId('event'),
        ...event,
        createdAt: now,
        isMock: true,
      },
      ...appState.eventLog,
    ].slice(0, MAX_EVENT_LOG_ENTRIES),
    updatedAt: now,
  }
}

function updateLatestTelemetry(appState, deviceId, changes) {
  const latestIndex = appState.telemetry.findLastIndex(
    (record) => record.deviceId === deviceId,
  )

  if (latestIndex < 0) {
    return appState
  }

  const telemetry = [...appState.telemetry]
  telemetry[latestIndex] = {
    ...telemetry[latestIndex],
    ...changes,
    recordedAt: new Date().toISOString(),
  }

  return { ...appState, telemetry }
}

export function appendTelemetry(appState, deviceId, values) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับ Telemetry')
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_OFFLINE', 'หยุด Telemetry เนื่องจากอุปกรณ์ Offline')
  }

  const now = new Date().toISOString()
  const recordsForOtherDevices = appState.telemetry.filter(
    (record) => record.deviceId !== deviceId,
  )
  const recordsForDevice = appState.telemetry
    .filter((record) => record.deviceId === deviceId)
    .slice(-(MAX_TELEMETRY_PER_DEVICE - 1))
  const record = {
    id: createMockId('telemetry'),
    deviceId,
    flowRate: Number(values.flowRate ?? 0),
    usageTotal: Number(values.usageTotal ?? 0),
    usageUnit: 'LITERS',
    recordedAt: now,
    isMock: true,
  }

  if (device.capabilities.temperature) {
    record.temperature = Number(values.temperature ?? 27)
  }

  if (device.capabilities.pressure) {
    record.pressure = Number(values.pressure ?? 58)
  }

  const nextState = {
    ...appState,
    devices: appState.devices.map((item) => (
      item.id === deviceId ? { ...item, lastSeenAt: now } : item
    )),
    telemetry: [...recordsForOtherDevices, ...recordsForDevice, record],
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'TELEMETRY_APPENDED',
      message: 'เพิ่ม Telemetry จำลองแล้ว',
      record,
    },
  }
}

export function advanceTelemetry(appState, tickIndex) {
  const activeDevices = appState.devices.filter(
    ({ status }) => status !== 'OFFLINE',
  )

  if (activeDevices.length === 0) {
    return {
      state: appState,
      result: {
        success: true,
        code: 'TELEMETRY_TICK_SKIPPED',
        message: 'ไม่มีอุปกรณ์ที่พร้อมส่ง Telemetry',
        records: [],
      },
    }
  }

  let nextState = appState
  const records = []

  activeDevices.forEach((device) => {
    const latestTelemetry = getLatestDeviceTelemetry(
      nextState.telemetry,
      device.id,
    )
    const values = createNextTelemetryValues(
      device,
      latestTelemetry,
      tickIndex,
    )
    const outcome = appendTelemetry(nextState, device.id, values)

    nextState = outcome.state

    if (outcome.result.success) {
      records.push(outcome.result.record)
    }
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'TELEMETRY_TICK_COMPLETED',
      message: `เพิ่ม Telemetry จำลอง ${records.length} อุปกรณ์แล้ว`,
      records,
    },
  }
}

export function simulateLeak(appState, deviceId, sensorId) {
  const device = appState.devices.find(({ id }) => id === deviceId)
  const sensor = appState.leakSensors.find(
    (item) => item.id === sensorId && item.deviceId === deviceId,
  )

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับจำลองน้ำรั่ว')
  }

  if (!sensor) {
    return failure(appState, 'SENSOR_NOT_FOUND', 'ไม่พบ Sensor สำหรับจำลองน้ำรั่ว')
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_OFFLINE', 'ไม่สามารถจำลอง Leak ขณะอุปกรณ์ Offline')
  }

  const duplicateLeak = appState.alerts.some(
    (alert) => alert.deviceId === deviceId
      && alert.sensorId === sensorId
      && alert.type === 'SENSOR_LEAK'
      && alert.status !== 'RESOLVED',
  )

  if (duplicateLeak) {
    return failure(appState, 'LEAK_ALREADY_ACTIVE', 'Sensor นี้มี Leak ที่ยังไม่ Resolved')
  }

  const now = new Date().toISOString()
  let nextState = {
    ...appState,
    devices: appState.devices.map((item) => (
      item.id === deviceId ? { ...item, status: 'WARNING', lastSeenAt: now } : item
    )),
    leakSensors: appState.leakSensors.map((item) => (
      item.id === sensorId ? { ...item, status: 'LEAK', lastSeenAt: now } : item
    )),
    updatedAt: now,
  }
  const alertOutcome = createAlert(nextState, {
    deviceId,
    sensorId,
    type: 'SENSOR_LEAK',
    severity: 'CRITICAL',
    title: `ตรวจพบน้ำรั่วที่ ${sensor.zone}`,
    message: 'ระบบจำลองตรวจพบน้ำและสั่งปิดวาล์วอัตโนมัติ',
  })
  nextState = alertOutcome.state
  const valveOutcome = requestValveCommand(nextState, deviceId, {
    command: 'CLOSE',
    source: 'AUTOMATION',
    requestedBy: 'SYSTEM',
    reason: `ตรวจพบ Leak จาก ${sensor.name}`,
  })
  nextState = addEvent(valveOutcome.state, {
    deviceId,
    sensorId,
    type: 'LEAK_SIMULATED',
    severity: 'CRITICAL',
    message: `จำลองน้ำรั่วที่ ${sensor.zone} และปิดวาล์วอัตโนมัติ`,
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'LEAK_SIMULATED',
      message: 'จำลองน้ำรั่ว สร้าง Critical Alert และปิดวาล์วแล้ว',
      alert: alertOutcome.result.alert,
      valveCommand: valveOutcome.result.command,
    },
  }
}

export function simulateLeakResolved(appState, deviceId, sensorId, actor) {
  if (actor?.role !== 'ADMIN') {
    return failure(
      appState,
      'ADMIN_REQUIRED',
      'เฉพาะ Admin เท่านั้นที่ปิดการจำลองน้ำรั่วได้',
    )
  }

  const device = appState.devices.find(({ id }) => id === deviceId)
  const sensor = appState.leakSensors.find(
    (item) => item.id === sensorId && item.deviceId === deviceId,
  )

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับปิดการจำลองน้ำรั่ว')
  }

  if (!sensor) {
    return failure(appState, 'SENSOR_NOT_FOUND', 'ไม่พบ Sensor สำหรับปิดการจำลองน้ำรั่ว')
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_OFFLINE', 'ไม่สามารถปิดการจำลอง Leak ขณะอุปกรณ์ Offline')
  }

  if (sensor.status !== 'LEAK') {
    return failure(appState, 'LEAK_NOT_ACTIVE', 'Sensor นี้ไม่มี Leak ที่กำลัง Active')
  }

  const relatedAlerts = appState.alerts
    .filter(
    (alert) => alert.deviceId === deviceId
      && alert.sensorId === sensorId
      && alert.type === 'SENSOR_LEAK',
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  const activeAlert = relatedAlerts.find(({ status }) => status !== 'RESOLVED')
  const relatedAlert = activeAlert ?? relatedAlerts[0]

  if (!relatedAlert) {
    return failure(
      appState,
      'LEAK_ALERT_NOT_FOUND',
      'ไม่พบ Alert ที่สัมพันธ์กับ Sensor นี้',
    )
  }

  let nextState = appState

  if (activeAlert?.status === 'OPEN') {
    const acknowledgeOutcome = acknowledgeAlert(
      nextState,
      activeAlert.id,
      actor.id,
    )
    nextState = acknowledgeOutcome.state
  }

  if (activeAlert) {
    const resolveOutcome = resolveAlert(
      nextState,
      activeAlert.id,
      actor.id,
      `ลูกค้าแจ้งว่าแก้ไขจุดรั่วที่ ${sensor.zone} และตรวจสอบพื้นที่แล้ว (ข้อมูลจำลอง)`,
    )

    if (!resolveOutcome.result.success) {
      return resolveOutcome
    }

    nextState = resolveOutcome.state
  }

  const now = new Date().toISOString()
  const leakSensors = nextState.leakSensors.map((item) => (
    item.id === sensorId
      ? { ...item, status: 'NORMAL', lastSeenAt: now }
      : item
  ))
  const hasRemainingLeak = leakSensors.some(
    (item) => item.deviceId === deviceId && item.status === 'LEAK',
  )
  const hasRemainingAlert = nextState.alerts.some(
    (alert) => alert.deviceId === deviceId && alert.status !== 'RESOLVED',
  )

  nextState = {
    ...nextState,
    devices: nextState.devices.map((item) => (
      item.id === deviceId
        ? {
          ...item,
          status: hasRemainingLeak || hasRemainingAlert ? 'WARNING' : 'ONLINE',
          lastSeenAt: now,
        }
        : item
    )),
    leakSensors,
    updatedAt: now,
  }
  nextState = addEvent(nextState, {
    deviceId,
    sensorId,
    actorId: actor.id,
    type: 'LEAK_CLEARED_SIMULATED',
    severity: 'INFO',
    message: `จำลองลูกค้าแก้ไขจุดรั่วที่ ${sensor.zone} แล้ว โดยวาล์วยังคงปิดอยู่`,
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'LEAK_CLEARED_SIMULATED',
      message: 'Sensor กลับเป็น Normal และปิด Alert แล้ว โดยวาล์วยังคงปิดอยู่',
      alertId: relatedAlert.id,
      sensorId,
    },
  }
}

export function simulateOffline(appState, deviceId) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับจำลอง Offline')
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_ALREADY_OFFLINE', 'อุปกรณ์อยู่ในสถานะ Offline แล้ว')
  }

  const now = new Date().toISOString()
  let nextState = {
    ...appState,
    devices: appState.devices.map((item) => (
      item.id === deviceId ? { ...item, status: 'OFFLINE', lastSeenAt: now } : item
    )),
    leakSensors: appState.leakSensors.map((sensor) => (
      sensor.deviceId === deviceId
        ? { ...sensor, status: 'OFFLINE', lastSeenAt: now }
        : sensor
    )),
    updatedAt: now,
  }
  const alertOutcome = createAlert(nextState, {
    deviceId,
    type: 'OFFLINE',
    severity: 'WARNING',
    title: 'อุปกรณ์ Offline',
    message: 'อุปกรณ์ถูกเปลี่ยนเป็น Offline โดย Device Simulator',
  })
  nextState = addEvent(alertOutcome.state, {
    deviceId,
    type: 'DEVICE_OFFLINE_SIMULATED',
    severity: 'WARNING',
    message: `จำลอง ${device.name} เป็น Offline`,
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'OFFLINE_SIMULATED',
      message: 'จำลองอุปกรณ์ Offline แล้ว',
      alert: alertOutcome.result.alert,
    },
  }
}

export function simulateAbnormalTemperature(appState, deviceId) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับจำลองอุณหภูมิ')
  }

  if (!device.capabilities.temperature) {
    return failure(
      appState,
      'TEMPERATURE_NOT_SUPPORTED',
      `อุปกรณ์รุ่น ${device.model} ไม่รองรับ Temperature`,
    )
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_OFFLINE', 'ไม่สามารถจำลอง Temperature ขณะอุปกรณ์ Offline')
  }

  let nextState = updateLatestTelemetry(appState, deviceId, { temperature: 52 })
  const alertOutcome = createAlert(nextState, {
    deviceId,
    type: 'TEMPERATURE',
    severity: 'WARNING',
    title: 'อุณหภูมิน้ำสูงผิดปกติ',
    message: 'Device Simulator ปรับอุณหภูมิจำลองเป็น 52 °C',
  })
  nextState = addEvent(alertOutcome.state, {
    deviceId,
    type: 'TEMPERATURE_SIMULATED',
    severity: 'WARNING',
    message: 'จำลองอุณหภูมิน้ำสูง 52 °C',
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'TEMPERATURE_SIMULATED',
      message: 'จำลองอุณหภูมิผิดปกติแล้ว',
      alert: alertOutcome.result.alert,
    },
  }
}

export function simulateHighPressure(appState, deviceId) {
  const device = appState.devices.find(({ id }) => id === deviceId)

  if (!device) {
    return failure(appState, 'DEVICE_NOT_FOUND', 'ไม่พบอุปกรณ์สำหรับจำลองแรงดัน')
  }

  if (!device.capabilities.pressure) {
    return failure(
      appState,
      'PRESSURE_NOT_SUPPORTED',
      `อุปกรณ์รุ่น ${device.model} ไม่รองรับ Pressure`,
    )
  }

  if (device.status === 'OFFLINE') {
    return failure(appState, 'DEVICE_OFFLINE', 'ไม่สามารถจำลอง Pressure ขณะอุปกรณ์ Offline')
  }

  let nextState = updateLatestTelemetry(appState, deviceId, { pressure: 88 })
  const alertOutcome = createAlert(nextState, {
    deviceId,
    type: 'PRESSURE',
    severity: 'WARNING',
    title: 'แรงดันน้ำสูงผิดปกติ',
    message: 'Device Simulator ปรับแรงดันจำลองเป็น 88 PSI',
  })
  nextState = addEvent(alertOutcome.state, {
    deviceId,
    type: 'PRESSURE_SIMULATED',
    severity: 'WARNING',
    message: 'จำลองแรงดันน้ำสูง 88 PSI',
  })

  return {
    state: nextState,
    result: {
      success: true,
      code: 'PRESSURE_SIMULATED',
      message: 'จำลองแรงดันผิดปกติแล้ว',
      alert: alertOutcome.result.alert,
    },
  }
}
