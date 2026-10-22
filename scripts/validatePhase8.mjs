import assert from 'node:assert/strict'
import {
  acknowledgeAlert,
  appendTelemetry,
  createInitialAppState,
  getValveCommandAvailability,
  loadSession,
  resetDemoData,
  resolveAlert,
  saveSession,
  simulateAbnormalTemperature,
  simulateHighPressure,
  simulateLeak,
  simulateLeakResolved,
  simulateOffline,
} from '../src/services/index.js'
import { createAlertListItems } from '../src/utils/alertSelectors.js'
import { getDashboardKpis } from '../src/utils/dashboardSelectors.js'
import { getDeviceAlerts } from '../src/utils/deviceDetailSelectors.js'
import {
  createNextTelemetryValues,
  getDeviceSimulationEvents,
  getLatestDeviceTelemetry,
  SIMULATION_INTERVAL_MS,
} from '../src/utils/simulatorSelectors.js'

class MemoryStorage {
  constructor() {
    this.values = new Map()
  }

  getItem(key) {
    return this.values.get(key) ?? null
  }

  setItem(key, value) {
    this.values.set(key, value)
  }

  removeItem(key) {
    this.values.delete(key)
  }
}

let state = createInitialAppState()
const lpg365 = state.devices.find(({ model }) => model === 'LPG365')
const lpg365p = state.devices.find(({ model }) => model === 'LPG365-P')
const latest365 = getLatestDeviceTelemetry(state.telemetry, lpg365.id)
const latest365p = getLatestDeviceTelemetry(state.telemetry, lpg365p.id)

const next365 = createNextTelemetryValues(lpg365, latest365, 1)
const repeated365 = createNextTelemetryValues(lpg365, latest365, 1)
assert.deepEqual(next365, repeated365)
assert.ok(Object.hasOwn(next365, 'temperature'))
assert.equal(Object.hasOwn(next365, 'pressure'), false)
assert.ok(next365.usageTotal > latest365.usageTotal)

const next365p = createNextTelemetryValues(lpg365p, latest365p, 1)
assert.ok(Object.hasOwn(next365p, 'pressure'))
assert.equal(Object.hasOwn(next365p, 'temperature'), false)
assert.ok(next365p.usageTotal > latest365p.usageTotal)
assert.equal(SIMULATION_INTERVAL_MS, 4000)

const telemetryBefore = state.telemetry.filter(({ deviceId }) => deviceId === lpg365.id).length
const appended = appendTelemetry(state, lpg365.id, next365)
assert.equal(appended.result.success, true)
state = appended.state
assert.equal(
  state.telemetry.filter(({ deviceId }) => deviceId === lpg365.id).length,
  telemetryBefore,
)
assert.equal(getLatestDeviceTelemetry(state.telemetry, lpg365.id).id, appended.result.record.id)
assert.equal(
  state.devices.find(({ id }) => id === lpg365.id).lastSeenAt,
  appended.result.record.recordedAt,
)

const temperatureOutcome = simulateAbnormalTemperature(state, lpg365.id)
assert.equal(temperatureOutcome.result.success, true)
assert.equal(temperatureOutcome.result.alert.type, 'TEMPERATURE')
assert.equal(
  getLatestDeviceTelemetry(temperatureOutcome.state.telemetry, lpg365.id).temperature,
  52,
)
assert.equal(simulateHighPressure(state, lpg365.id).result.code, 'PRESSURE_NOT_SUPPORTED')

const pressureOutcome = simulateHighPressure(state, lpg365p.id)
assert.equal(pressureOutcome.result.success, true)
assert.equal(pressureOutcome.result.alert.type, 'PRESSURE')
assert.equal(
  getLatestDeviceTelemetry(pressureOutcome.state.telemetry, lpg365p.id).pressure,
  88,
)
assert.equal(
  simulateAbnormalTemperature(state, lpg365p.id).result.code,
  'TEMPERATURE_NOT_SUPPORTED',
)

state = createInitialAppState()
const sensor = state.leakSensors.find(({ deviceId }) => deviceId === lpg365.id)
const activeAlertsBefore = getDashboardKpis(state).activeAlerts
const leakOutcome = simulateLeak(state, lpg365.id, sensor.id)
assert.equal(leakOutcome.result.success, true)
state = leakOutcome.state
assert.equal(state.leakSensors.find(({ id }) => id === sensor.id).status, 'LEAK')
assert.equal(state.devices.find(({ id }) => id === lpg365.id).valveStatus, 'CLOSED')
assert.equal(leakOutcome.result.alert.severity, 'CRITICAL')
assert.equal(leakOutcome.result.alert.status, 'OPEN')
assert.equal(leakOutcome.result.valveCommand.command, 'CLOSE')
assert.equal(leakOutcome.result.valveCommand.source, 'AUTOMATION')
assert.equal(leakOutcome.result.valveCommand.status, 'SUCCESS')
assert.equal(getDeviceSimulationEvents(state.eventLog, lpg365.id)[0].type, 'LEAK_SIMULATED')
assert.equal(getDashboardKpis(state).activeAlerts, activeAlertsBefore + 1)
assert.equal(getDeviceAlerts(state.alerts, lpg365.id)[0].id, leakOutcome.result.alert.id)
assert.equal(createAlertListItems(state)[0].alert.id, leakOutcome.result.alert.id)
assert.equal(getValveCommandAvailability(state, lpg365.id, 'OPEN').code, 'ACTIVE_LEAK')
assert.equal(simulateLeak(state, lpg365.id, sensor.id).result.code, 'LEAK_ALREADY_ACTIVE')

const admin = state.users.find(({ role }) => role === 'ADMIN')
const user = state.users.find(({ role }) => role === 'USER')
assert.equal(
  simulateLeakResolved(state, lpg365.id, sensor.id, user).result.code,
  'ADMIN_REQUIRED',
)
const resolvedLeakOutcome = simulateLeakResolved(
  state,
  lpg365.id,
  sensor.id,
  admin,
)
assert.equal(resolvedLeakOutcome.result.success, true)
state = resolvedLeakOutcome.state
assert.equal(state.leakSensors.find(({ id }) => id === sensor.id).status, 'NORMAL')
assert.equal(state.devices.find(({ id }) => id === lpg365.id).valveStatus, 'CLOSED')
const resolvedLeakAlert = state.alerts.find(({ id }) => id === leakOutcome.result.alert.id)
assert.equal(resolvedLeakAlert.status, 'RESOLVED')
assert.equal(resolvedLeakAlert.acknowledgedBy, admin.id)
assert.equal(resolvedLeakAlert.resolvedBy, admin.id)
assert.match(resolvedLeakAlert.resolutionNote, /ลูกค้าแจ้งว่าแก้ไขจุดรั่ว/)
assert.equal(getDeviceSimulationEvents(state.eventLog, lpg365.id)[0].type, 'LEAK_CLEARED_SIMULATED')
assert.equal(getDashboardKpis(state).activeAlerts, activeAlertsBefore)
assert.equal(simulateLeakResolved(state, lpg365.id, sensor.id, admin).result.code, 'LEAK_NOT_ACTIVE')

state = createInitialAppState()
const manuallyResolvedLeak = simulateLeak(state, lpg365.id, sensor.id)
state = manuallyResolvedLeak.state
state = acknowledgeAlert(state, manuallyResolvedLeak.result.alert.id, admin.id).state
state = resolveAlert(
  state,
  manuallyResolvedLeak.result.alert.id,
  admin.id,
  'Admin ปิด Incident หลังตรวจสอบแล้ว',
).state
const recoveryAfterManualResolve = simulateLeakResolved(
  state,
  lpg365.id,
  sensor.id,
  admin,
)
assert.equal(recoveryAfterManualResolve.result.success, true)
state = recoveryAfterManualResolve.state
assert.equal(state.leakSensors.find(({ id }) => id === sensor.id).status, 'NORMAL')
assert.equal(state.devices.find(({ id }) => id === lpg365.id).valveStatus, 'CLOSED')
assert.equal(
  state.alerts.find(({ id }) => id === manuallyResolvedLeak.result.alert.id).status,
  'RESOLVED',
)

state = createInitialAppState()
const offlineOutcome = simulateOffline(state, lpg365.id)
assert.equal(offlineOutcome.result.success, true)
state = offlineOutcome.state
assert.equal(state.devices.find(({ id }) => id === lpg365.id).status, 'OFFLINE')
assert.ok(state.leakSensors.filter(({ deviceId }) => deviceId === lpg365.id).every(({ status }) => status === 'OFFLINE'))
assert.equal(appendTelemetry(state, lpg365.id, next365).result.code, 'DEVICE_OFFLINE')
assert.equal(simulateLeak(state, lpg365.id, sensor.id).result.code, 'DEVICE_OFFLINE')
assert.equal(simulateOffline(state, lpg365.id).result.code, 'DEVICE_ALREADY_OFFLINE')
assert.equal(getValveCommandAvailability(state, lpg365.id, 'CLOSE').code, 'DEVICE_OFFLINE')

state = createInitialAppState()
for (let index = 0; index < 105; index += 1) {
  state = simulateAbnormalTemperature(state, lpg365.id).state
}
assert.equal(state.eventLog.length, 100)
assert.equal(getDeviceSimulationEvents(state.eventLog, lpg365.id).length, 20)

const memoryStorage = new MemoryStorage()
saveSession(state.users[0], memoryStorage)
const sessionBeforeReset = loadSession(memoryStorage)
const resetState = resetDemoData(memoryStorage)
const sessionAfterReset = loadSession(memoryStorage)
assert.deepEqual(sessionAfterReset, sessionBeforeReset)
assert.equal(resetState.eventLog.length, 0)
assert.equal(resetState.devices.length, createInitialAppState().devices.length)

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    fourSecondDeterministicTelemetry: true,
    telemetryRetention: true,
    lpg365TemperatureOnly: true,
    lpg365pPressureOnly: true,
    leakCriticalAutoClose: true,
    adminOnlyLeakRecovery: true,
    leakRecoveryKeepsValveClosed: true,
    leakRecoveryAfterManualResolve: true,
    crossPageSharedState: true,
    activeLeakValveSafety: true,
    offlineStopsTelemetryAndControl: true,
    eventLogRetention: true,
    resetKeepsSession: true,
  },
}, null, 2))
