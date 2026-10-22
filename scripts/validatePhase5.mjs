import assert from 'node:assert/strict'
import { addDevice, updateDevice } from '../src/services/deviceService.js'
import { createInitialAppState } from '../src/services/storageService.js'
import { createDeviceListItems, filterDevices } from '../src/utils/deviceFilters.js'

let state = createInitialAppState()

const combinedFilter = filterDevices(state.devices, {
  query: 'กรุงเทพ',
  status: 'WARNING',
  model: 'LPG365-P',
})
assert.deepEqual(combinedFilter.map(({ id }) => id), ['device-365p-001'])
assert.equal(filterDevices(state.devices, { query: 'lpg365-th-002' }).length, 1)
assert.equal(filterDevices(state.devices, { query: 'ผู้ใช้งานตัวอย่าง lpg365-p' }).length, 2)

const add365Outcome = addDevice(state, {
  serialNumber: 'LPG365-PHASE5-001',
  name: 'Phase 5 Temperature Device',
  model: 'LPG365',
  assignedUserId: 'user-365-001',
  customerName: 'ลูกค้าทดสอบ LPG365',
  location: 'ห้องทดสอบ เชียงใหม่',
  status: 'ONLINE',
  protectionEnabled: true,
  firmwareVersion: 'DEMO-5.0.0',
})
assert.equal(add365Outcome.result.success, true)
state = add365Outcome.state
const added365 = add365Outcome.result.device
assert.equal(added365.model, 'LPG365')
assert.equal(added365.capabilities.temperature, true)
assert.equal(added365.capabilities.pressure, false)
assert.equal(added365.valveStatus, 'CLOSED')
assert.equal(state.telemetry.some(({ deviceId }) => deviceId === added365.id), false)
assert.equal(state.leakSensors.filter(({ deviceId }) => deviceId === added365.id).length, 3)
assert.ok(state.users.find(({ id }) => id === 'user-365-001').assignedDeviceIds.includes(added365.id))

const add365pOutcome = addDevice(state, {
  serialNumber: 'LPG365P-PHASE5-002',
  name: 'Phase 5 Pressure Device',
  model: 'LPG365-P',
  assignedUserId: 'user-365p-001',
  location: 'ห้องทดสอบ กรุงเทพฯ',
})
assert.equal(add365pOutcome.result.success, true)
state = add365pOutcome.state
const added365p = add365pOutcome.result.device
assert.equal(added365p.capabilities.temperature, false)
assert.equal(added365p.capabilities.pressure, true)
assert.equal(state.leakSensors.filter(({ deviceId }) => deviceId === added365p.id).length, 3)

const listItem = createDeviceListItems(
  [added365p],
  state.telemetry,
  state.users,
)[0]
assert.equal(listItem.latestTelemetry, null)
assert.equal(listItem.assignedUser.id, 'user-365p-001')

const duplicateOutcome = addDevice(state, {
  serialNumber: 'lpg365-phase5-001',
  name: 'Duplicate',
  model: 'LPG365-P',
  location: 'Duplicate Room',
})
assert.equal(duplicateOutcome.result.success, false)
assert.equal(duplicateOutcome.result.code, 'DUPLICATE_SERIAL_NUMBER')

const invalidOutcome = addDevice(state, {
  serialNumber: '',
  name: '',
  model: 'LPG365-P',
  location: '',
})
assert.equal(invalidOutcome.result.success, false)
assert.equal(invalidOutcome.result.code, 'INVALID_DEVICE')

const previousTelemetryCount = state.telemetry.filter(
  ({ deviceId }) => deviceId === 'device-365-001',
).length
const updateOutcome = updateDevice(state, 'device-365-001', {
  model: 'LPG365-P',
  assignedUserId: 'user-365p-001',
  status: 'WARNING',
})
assert.equal(updateOutcome.result.success, true)
state = updateOutcome.state
const updatedDevice = updateOutcome.result.device
assert.equal(updatedDevice.capabilities.temperature, false)
assert.equal(updatedDevice.capabilities.pressure, true)
assert.equal(updatedDevice.status, 'WARNING')
assert.equal(
  state.telemetry.filter(({ deviceId }) => deviceId === updatedDevice.id).length,
  previousTelemetryCount,
)
assert.ok(state.telemetry.filter(({ deviceId }) => deviceId === updatedDevice.id).every((record) => (
  Object.hasOwn(record, 'pressure') && !Object.hasOwn(record, 'temperature')
)))
assert.equal(
  state.users.find(({ id }) => id === 'user-365-001').assignedDeviceIds.includes(updatedDevice.id),
  false,
)
assert.equal(
  state.users.find(({ id }) => id === 'user-365p-001').assignedDeviceIds.includes(updatedDevice.id),
  true,
)

const duplicateUpdate = updateDevice(state, added365.id, {
  serialNumber: added365p.serialNumber,
})
assert.equal(duplicateUpdate.result.success, false)
assert.equal(duplicateUpdate.result.code, 'DUPLICATE_SERIAL_NUMBER')

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    combinedSearchAndFilters: true,
    addLpg365: true,
    addLpg365p: true,
    createThreeSensors: true,
    noFabricatedTelemetry: true,
    uniqueSerialValidation: true,
    requiredFieldValidation: true,
    modelCapabilityMigration: true,
    assignedUserSynchronization: true,
  },
}, null, 2))
