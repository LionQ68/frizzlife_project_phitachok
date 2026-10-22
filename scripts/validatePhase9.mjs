import assert from 'node:assert/strict'
import {
  canUserAccessDevice,
  createInitialAppState,
  getDevicesForUser,
  requestAuthorizedValveCommand,
  simulateLeak,
  updateSensorDetails,
} from '../src/services/index.js'
import { getUserDashboardData } from '../src/utils/userDashboardSelectors.js'

let state = createInitialAppState()
const user365 = state.users.find(({ email }) => email === 'user_365@frizzlife.demo')
const user365p = state.users.find(({ email }) => email === 'user_365p@frizzlife.demo')
const admin = state.users.find(({ role }) => role === 'ADMIN')
const devices365 = getDevicesForUser(state, user365)
const devices365p = getDevicesForUser(state, user365p)

assert.equal(devices365.length, 1)
assert.equal(devices365[0].model, 'LPG365')
assert.equal(devices365p.length, 2)
assert.ok(devices365p.every(({ model }) => model === 'LPG365-P'))
assert.equal(canUserAccessDevice(user365, devices365[0].id), true)
assert.equal(canUserAccessDevice(user365, devices365p[0].id), false)
assert.equal(canUserAccessDevice(admin, devices365p[0].id), true)

const deniedValve = requestAuthorizedValveCommand(
  state,
  devices365p[0].id,
  { command: 'CLOSE', reason: 'ทดสอบสิทธิ์ข้ามบัญชี' },
  user365,
)
assert.equal(deniedValve.result.code, 'DEVICE_ACCESS_DENIED')
assert.strictEqual(deniedValve.state, state)

const closeValve = requestAuthorizedValveCommand(
  state,
  devices365[0].id,
  { command: 'CLOSE', reason: 'ผู้ใช้ทดสอบปิดวาล์ว' },
  user365,
)
assert.equal(closeValve.result.success, true)
assert.equal(closeValve.result.command.requestedBy, user365.id)
assert.equal(closeValve.result.command.source, 'USER')
state = closeValve.state

const assignedSensor = state.leakSensors.find(
  ({ deviceId }) => deviceId === devices365[0].id,
)
const sensorUpdate = updateSensorDetails(
  state,
  assignedSensor.id,
  { name: 'Sensor ห้องครัว', zone: 'ใต้ซิงก์ชั้นล่าง' },
  user365,
)
assert.equal(sensorUpdate.result.success, true)
assert.equal(sensorUpdate.result.sensor.name, 'Sensor ห้องครัว')
assert.equal(sensorUpdate.result.sensor.zone, 'ใต้ซิงก์ชั้นล่าง')
state = sensorUpdate.state

const otherSensor = state.leakSensors.find(
  ({ deviceId }) => deviceId === devices365p[0].id,
)
const deniedSensor = updateSensorDetails(
  state,
  otherSensor.id,
  { name: 'ห้ามแก้ไข', zone: 'อุปกรณ์ผู้อื่น' },
  user365,
)
assert.equal(deniedSensor.result.code, 'DEVICE_ACCESS_DENIED')
assert.strictEqual(deniedSensor.state, state)

const leakOutcome = simulateLeak(state, devices365[0].id, assignedSensor.id)
assert.equal(leakOutcome.result.success, true)
state = leakOutcome.state
const blockedOpen = requestAuthorizedValveCommand(
  state,
  devices365[0].id,
  { command: 'OPEN', reason: 'ทดสอบ Safety Block' },
  user365,
)
assert.equal(blockedOpen.result.code, 'ACTIVE_LEAK')

const userDashboard = getUserDashboardData(
  state,
  getDevicesForUser(state, user365),
  devices365[0].id,
)
assert.equal(userDashboard.device.id, devices365[0].id)
assert.equal(userDashboard.sensors.length, 3)
assert.equal(userDashboard.hasActiveLeak, true)
assert.equal(userDashboard.hasActiveCriticalAlert, true)
assert.ok(userDashboard.alerts.every(({ deviceId }) => deviceId === devices365[0].id))
assert.equal(Object.hasOwn(userDashboard.latestTelemetry, 'temperature'), true)
assert.equal(Object.hasOwn(userDashboard.latestTelemetry, 'pressure'), false)

const dashboard365p = getUserDashboardData(
  state,
  getDevicesForUser(state, user365p),
  devices365p[0].id,
)
assert.equal(Object.hasOwn(dashboard365p.latestTelemetry, 'pressure'), true)
assert.equal(Object.hasOwn(dashboard365p.latestTelemetry, 'temperature'), false)
assert.ok(dashboard365p.alerts.every(
  ({ deviceId }) => user365p.assignedDeviceIds.includes(deviceId),
))

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    user365SeesAssignedModelOnly: true,
    user365pSeesAssignedDevicesOnly: true,
    crossAccountValveDenied: true,
    crossAccountSensorEditDenied: true,
    sensorRenameAndLocationUpdated: true,
    valveConfirmationActionIsAudited: true,
    activeLeakBlocksOpen: true,
    personalAlertsAreIsolated: true,
    lpg365TemperatureOnly: true,
    lpg365pPressureOnly: true,
  },
}, null, 2))
