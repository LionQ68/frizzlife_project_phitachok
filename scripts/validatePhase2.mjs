import assert from 'node:assert/strict'
import {
  acknowledgeAlert,
  addDevice,
  appendTelemetry,
  createInitialAppState,
  getDevicesForUser,
  loadAppState,
  loadSession,
  login,
  requestValveCommand,
  resetDemoData,
  resolveAlert,
  saveAppState,
  simulateAbnormalTemperature,
  simulateHighPressure,
  simulateLeak,
  updateDevice,
} from '../src/services/index.js'

function createMemoryStorage() {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
  }
}

const storage = createMemoryStorage()
let state = createInitialAppState()

const adminLogin = login(state.users, {
  email: 'ADMIN@FRIZZLIFE.DEMO',
  password: 'Demo1234',
}, storage)
assert.equal(adminLogin.success, true)
assert.equal('password' in adminLogin.user, false)
assert.equal('password' in loadSession(storage), false)

const user365 = login(state.users, {
  email: 'user_365@frizzlife.demo',
  password: 'Demo1234',
}, storage).user
const user365p = login(state.users, {
  email: 'user_365p@frizzlife.demo',
  password: 'Demo1234',
}, storage).user
assert.deepEqual(
  getDevicesForUser(state, user365).map(({ model }) => model),
  ['LPG365'],
)
assert.equal(getDevicesForUser(state, user365p).length, 2)
assert.ok(
  getDevicesForUser(state, user365p).every(({ model }) => model === 'LPG365-P'),
)
assert.equal(getDevicesForUser(state, adminLogin.user).length, 3)

const addOutcome = addDevice(state, {
  serialNumber: 'LPG365-DEMO-NEW',
  name: 'New Demo Device',
  model: 'LPG365',
  location: 'สถานที่ทดสอบ',
  assignedUserId: 'user-365-001',
})
assert.equal(addOutcome.result.success, true)
state = addOutcome.state
const addedDevice = addOutcome.result.device
assert.equal(addedDevice.valveStatus, 'CLOSED')
assert.equal(addedDevice.capabilities.temperature, true)
assert.equal(addedDevice.capabilities.pressure, false)
assert.equal(
  state.leakSensors.filter(({ deviceId }) => deviceId === addedDevice.id).length,
  3,
)
assert.ok(
  state.users
    .find(({ id }) => id === 'user-365-001')
    .assignedDeviceIds.includes(addedDevice.id),
)

const updateOutcome = updateDevice(state, 'device-365-001', {
  model: 'LPG365-P',
})
assert.equal(updateOutcome.result.success, true)
assert.ok(
  updateOutcome.state.telemetry
    .filter(({ deviceId }) => deviceId === 'device-365-001')
    .every((record) => 'pressure' in record && !('temperature' in record)),
)

assert.equal(
  simulateAbnormalTemperature(createInitialAppState(), 'device-365p-001').result.success,
  false,
)
assert.equal(
  simulateHighPressure(createInitialAppState(), 'device-365-001').result.success,
  false,
)
assert.equal(
  simulateAbnormalTemperature(createInitialAppState(), 'device-365-001').result.success,
  true,
)
assert.equal(
  simulateHighPressure(createInitialAppState(), 'device-365p-001').result.success,
  true,
)

state = createInitialAppState()
const leakSensor = state.leakSensors.find(
  ({ deviceId }) => deviceId === 'device-365-001',
)
const leakOutcome = simulateLeak(state, 'device-365-001', leakSensor.id)
assert.equal(leakOutcome.result.success, true)
state = leakOutcome.state
assert.equal(
  state.devices.find(({ id }) => id === 'device-365-001').valveStatus,
  'CLOSED',
)
assert.equal(
  state.leakSensors.find(({ id }) => id === leakSensor.id).status,
  'LEAK',
)
const activeLeakAlert = state.alerts.find(
  ({ id }) => id === leakOutcome.result.alert.id,
)
assert.equal(activeLeakAlert.severity, 'CRITICAL')
assert.equal(activeLeakAlert.status, 'OPEN')

const blockedOpenOutcome = requestValveCommand(state, 'device-365-001', {
  command: 'OPEN',
  requestedBy: 'admin-001',
})
assert.equal(blockedOpenOutcome.result.success, false)
assert.equal(blockedOpenOutcome.result.code, 'ACTIVE_LEAK')
assert.equal(blockedOpenOutcome.result.command.status, 'FAILED')
state = blockedOpenOutcome.state

const acknowledgeOutcome = acknowledgeAlert(
  state,
  activeLeakAlert.id,
  'admin-001',
)
assert.equal(acknowledgeOutcome.result.success, true)
state = acknowledgeOutcome.state
const resolveOutcome = resolveAlert(
  state,
  activeLeakAlert.id,
  'admin-001',
  'ตรวจสอบและแก้ไขจุดรั่วแล้ว',
)
assert.equal(resolveOutcome.result.success, true)
state = resolveOutcome.state
assert.equal(
  state.devices.find(({ id }) => id === 'device-365-001').valveStatus,
  'CLOSED',
)

const stillBlockedAfterResolve = requestValveCommand(
  state,
  'device-365-001',
  { command: 'OPEN', requestedBy: 'admin-001' },
)
assert.equal(stillBlockedAfterResolve.result.success, false)
assert.equal(stillBlockedAfterResolve.result.code, 'ACTIVE_LEAK')
state = {
  ...stillBlockedAfterResolve.state,
  leakSensors: stillBlockedAfterResolve.state.leakSensors.map((sensor) => (
    sensor.id === leakSensor.id ? { ...sensor, status: 'NORMAL' } : sensor
  )),
}

const allowedOpenOutcome = requestValveCommand(state, 'device-365-001', {
  command: 'OPEN',
  requestedBy: 'admin-001',
})
assert.equal(allowedOpenOutcome.result.success, true)
assert.equal(
  allowedOpenOutcome.state.devices
    .find(({ id }) => id === 'device-365-001')
    .valveStatus,
  'OPEN',
)

state = createInitialAppState()
for (let index = 0; index < 730; index += 1) {
  state = appendTelemetry(state, 'device-365-001', {
    flowRate: 1.2,
    usageTotal: 1600 + index,
    temperature: 27,
  }).state
}
assert.equal(
  state.telemetry.filter(({ deviceId }) => deviceId === 'device-365-001').length,
  720,
)

assert.equal(saveAppState(state, storage), true)
assert.equal(loadAppState(storage).telemetry.length, state.telemetry.length)
const sessionBeforeReset = loadSession(storage)
const resetState = resetDemoData(storage)
assert.equal(resetState.devices.length, 3)
assert.deepEqual(loadSession(storage), sessionBeforeReset)

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    authentication: true,
    roleIsolation: true,
    persistence: true,
    deviceCreation: true,
    capabilityRules: true,
    alertLifecycle: true,
    leakAutoShutoff: true,
    valveSafety: true,
    telemetryLimit: true,
    resetKeepsSession: true,
  },
}, null, 2))
