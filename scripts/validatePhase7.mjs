import assert from 'node:assert/strict'
import {
  acknowledgeAlert,
  createAlert,
  createInitialAppState,
  resolveAlert,
} from '../src/services/index.js'
import {
  createAlertListItems,
  filterAlertItems,
  getAlertSummary,
  isAlertTypeSupportedByDevice,
} from '../src/utils/alertSelectors.js'

let state = createInitialAppState()
const lpg365 = state.devices.find(({ model }) => model === 'LPG365')
const lpg365p = state.devices.find(({ model }) => model === 'LPG365-P')

const items = createAlertListItems(state)
assert.equal(items.length, state.alerts.length)
assert.ok(items.every((item, index) => (
  index === 0
  || new Date(items[index - 1].alert.createdAt).getTime()
    >= new Date(item.alert.createdAt).getTime()
)))

const summary = getAlertSummary(state.alerts)
assert.deepEqual(summary, {
  active: 2,
  critical: 0,
  acknowledged: 0,
  resolved: 2,
})

const combinedFilter = filterAlertItems(items, {
  severity: 'WARNING',
  type: 'LOW_BATTERY',
  status: 'OPEN',
  deviceId: 'device-365p-001',
  model: 'LPG365-P',
})
assert.equal(combinedFilter.length, 1)
assert.equal(combinedFilter[0].alert.id, 'alert-low-battery-001')

const leakItem = items.find(({ alert }) => alert.id === 'alert-sensor-leak-001')
assert.equal(leakItem.device.id, 'device-365-001')
assert.equal(leakItem.sensor.id, 'device-365-001-sensor-kitchen')
assert.equal(leakItem.valveCommand.command, 'CLOSE')
assert.equal(leakItem.valveCommand.source, 'AUTOMATION')

assert.equal(isAlertTypeSupportedByDevice(lpg365, 'TEMPERATURE'), true)
assert.equal(isAlertTypeSupportedByDevice(lpg365, 'PRESSURE'), false)
assert.equal(isAlertTypeSupportedByDevice(lpg365p, 'PRESSURE'), true)
assert.equal(isAlertTypeSupportedByDevice(lpg365p, 'TEMPERATURE'), false)

const unsupportedPressure = createAlert(state, {
  deviceId: lpg365.id,
  type: 'PRESSURE',
  severity: 'WARNING',
  title: 'Pressure test',
  message: 'Phase 7 validation',
})
assert.equal(unsupportedPressure.result.code, 'UNSUPPORTED_ALERT_TYPE')

const unsupportedTemperature = createAlert(state, {
  deviceId: lpg365p.id,
  type: 'TEMPERATURE',
  severity: 'WARNING',
  title: 'Temperature test',
  message: 'Phase 7 validation',
})
assert.equal(unsupportedTemperature.result.code, 'UNSUPPORTED_ALERT_TYPE')

state = {
  ...state,
  devices: state.devices.map((device) => (
    device.id === lpg365.id ? { ...device, valveStatus: 'CLOSED' } : device
  )),
}
const created = createAlert(state, {
  deviceId: lpg365.id,
  type: 'TEMPERATURE',
  severity: 'WARNING',
  title: 'อุณหภูมิผิดปกติสำหรับ Phase 7',
  message: 'ข้อมูลจำลองสำหรับตรวจ lifecycle',
})
assert.equal(created.result.success, true)
assert.equal(created.result.alert.status, 'OPEN')
state = created.state

const resolveBeforeAcknowledge = resolveAlert(
  state,
  created.result.alert.id,
  'admin-001',
  'ไม่ควร Resolve ได้',
)
assert.equal(resolveBeforeAcknowledge.result.code, 'INVALID_ALERT_STATUS')

const acknowledged = acknowledgeAlert(state, created.result.alert.id, 'admin-001')
assert.equal(acknowledged.result.success, true)
state = acknowledged.state
const acknowledgedAlert = state.alerts.find(({ id }) => id === created.result.alert.id)
assert.equal(acknowledgedAlert.status, 'ACKNOWLEDGED')
assert.equal(acknowledgedAlert.acknowledgedBy, 'admin-001')
assert.ok(acknowledgedAlert.acknowledgedAt)

const missingNote = resolveAlert(state, created.result.alert.id, 'admin-001', '   ')
assert.equal(missingNote.result.code, 'RESOLUTION_REQUIRED')

const resolved = resolveAlert(
  state,
  created.result.alert.id,
  'admin-001',
  'ตรวจสอบพื้นที่และยืนยันความปลอดภัยแล้ว',
)
assert.equal(resolved.result.success, true)
const resolvedAlert = resolved.state.alerts.find(({ id }) => id === created.result.alert.id)
assert.equal(resolvedAlert.status, 'RESOLVED')
assert.equal(resolvedAlert.resolvedBy, 'admin-001')
assert.equal(resolvedAlert.resolutionNote, 'ตรวจสอบพื้นที่และยืนยันความปลอดภัยแล้ว')
assert.ok(resolvedAlert.resolvedAt)
assert.equal(
  resolved.state.devices.find(({ id }) => id === lpg365.id).valveStatus,
  'CLOSED',
)

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    alertSummary: true,
    combinedFilters: true,
    newestFirst: true,
    relatedDeviceSensorAndValveAction: true,
    lpg365TemperatureOnly: true,
    lpg365pPressureOnly: true,
    statusLifecycle: true,
    resolutionNoteRequired: true,
    auditFields: true,
    resolveKeepsValveClosed: true,
  },
}, null, 2))
