import assert from 'node:assert/strict'
import {
  acknowledgeAlert,
  createInitialAppState,
  getValveCommandAvailability,
  requestValveCommand,
  resolveAlert,
  simulateLeak,
} from '../src/services/index.js'
import {
  getDeviceAlerts,
  getDeviceHistorySeries,
  getDeviceSensors,
  getDeviceValveHistory,
} from '../src/utils/deviceDetailSelectors.js'

let state = createInitialAppState()
const lpg365 = state.devices.find(({ model }) => model === 'LPG365')
const lpg365p = state.devices.find(({ model }) => model === 'LPG365-P')

assert.equal(state.telemetry.filter(({ deviceId }) => deviceId === lpg365.id).length, 720)
assert.equal(state.telemetry.filter(({ deviceId }) => deviceId === lpg365p.id).length, 720)
assert.equal(getDeviceHistorySeries(state.telemetry, lpg365, '24H').sourceRecordCount, 24)
assert.equal(getDeviceHistorySeries(state.telemetry, lpg365, '7D').sourceRecordCount, 168)
assert.equal(getDeviceHistorySeries(state.telemetry, lpg365, '30D').sourceRecordCount, 720)

const temperatureSeries = getDeviceHistorySeries(state.telemetry, lpg365, '30D')
const pressureSeries = getDeviceHistorySeries(state.telemetry, lpg365p, '30D')
assert.equal(temperatureSeries.secondaryKey, 'temperature')
assert.equal(temperatureSeries.secondaryUnit, '°C')
assert.ok(temperatureSeries.records.every((record) => (
  Object.hasOwn(record, 'temperature') && !Object.hasOwn(record, 'pressure')
)))
assert.equal(pressureSeries.secondaryKey, 'pressure')
assert.equal(pressureSeries.secondaryUnit, 'PSI')
assert.ok(pressureSeries.records.every((record) => (
  Object.hasOwn(record, 'pressure') && !Object.hasOwn(record, 'temperature')
)))

assert.equal(getDeviceSensors(state.leakSensors, lpg365.id).length, 3)
assert.equal(getDeviceSensors(state.leakSensors, lpg365p.id).length, 3)

assert.equal(
  getValveCommandAvailability(state, 'device-365p-002', 'OPEN').code,
  'DEVICE_OFFLINE',
)
assert.equal(
  getValveCommandAvailability(state, 'device-365p-002', 'CLOSE').code,
  'DEVICE_OFFLINE',
)

let safetyState = {
  ...state,
  devices: state.devices.map((device) => (
    device.id === lpg365.id ? { ...device, valveStatus: 'CLOSED' } : device
  )),
  leakSensors: state.leakSensors.map((sensor) => (
    sensor.deviceId === lpg365.id && sensor.id.endsWith('kitchen')
      ? { ...sensor, status: 'LEAK' }
      : sensor
  )),
}
assert.equal(
  getValveCommandAvailability(safetyState, lpg365.id, 'OPEN').code,
  'ACTIVE_LEAK',
)

safetyState = {
  ...safetyState,
  leakSensors: safetyState.leakSensors.map((sensor) => (
    sensor.deviceId === lpg365.id ? { ...sensor, status: 'NORMAL' } : sensor
  )),
  alerts: [
    {
      id: 'phase6-critical-alert',
      deviceId: lpg365.id,
      sensorId: null,
      type: 'ABNORMAL_FLOW',
      severity: 'CRITICAL',
      status: 'OPEN',
      title: 'Phase 6 Critical',
      message: 'ข้อมูลจำลองสำหรับทดสอบ',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      isMock: true,
    },
    ...safetyState.alerts,
  ],
}
assert.equal(
  getValveCommandAvailability(safetyState, lpg365.id, 'OPEN').code,
  'ACTIVE_CRITICAL_ALERT',
)

const closeOutcome = requestValveCommand(state, lpg365.id, {
  command: 'CLOSE',
  requestedBy: 'admin-001',
  source: 'USER',
  reason: 'Phase 6 validation',
})
assert.equal(closeOutcome.result.success, true)
assert.equal(closeOutcome.result.command.status, 'SUCCESS')
assert.equal(closeOutcome.result.command.requestedBy, 'admin-001')
assert.equal(closeOutcome.result.command.reason, 'Phase 6 validation')
assert.equal(
  closeOutcome.state.devices.find(({ id }) => id === lpg365.id).valveStatus,
  'CLOSED',
)
assert.equal(getDeviceValveHistory(closeOutcome.state.valveCommands, lpg365.id)[0].id, closeOutcome.result.command.id)

state = createInitialAppState()
const leakSensor = getDeviceSensors(state.leakSensors, lpg365.id)[0]
const leakOutcome = simulateLeak(state, lpg365.id, leakSensor.id)
assert.equal(leakOutcome.result.success, true)
state = leakOutcome.state
const acknowledgeOutcome = acknowledgeAlert(
  state,
  leakOutcome.result.alert.id,
  'admin-001',
)
assert.equal(acknowledgeOutcome.result.success, true)
state = acknowledgeOutcome.state
const resolveOutcome = resolveAlert(
  state,
  leakOutcome.result.alert.id,
  'admin-001',
  'ยืนยันการแก้ไขสำหรับ Phase 6 validation',
)
assert.equal(resolveOutcome.result.success, true)
assert.equal(
  resolveOutcome.state.devices.find(({ id }) => id === lpg365.id).valveStatus,
  'CLOSED',
)
assert.equal(
  getValveCommandAvailability(resolveOutcome.state, lpg365.id, 'OPEN').code,
  'ACTIVE_LEAK',
)

const deviceAlerts = getDeviceAlerts(resolveOutcome.state.alerts, lpg365.id)
assert.ok(deviceAlerts.length > 0)
assert.ok(new Date(deviceAlerts[0].createdAt).getTime() >= new Date(deviceAlerts.at(-1).createdAt).getTime())

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    thirtyDayTelemetry: true,
    rangeSelection: true,
    lpg365TemperatureOnly: true,
    lpg365pPressureOnly: true,
    threeSensorsPerDevice: true,
    offlineValveSafety: true,
    activeLeakBlocksOpen: true,
    activeCriticalBlocksOpen: true,
    confirmationServiceHistory: true,
    resolveDoesNotOpenValve: true,
    deviceHistories: true,
  },
}, null, 2))
