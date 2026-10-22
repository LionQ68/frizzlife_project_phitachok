import assert from 'node:assert/strict'
import { createInitialAppState } from '../src/services/storageService.js'
import {
  getDailyUsageSeries,
  getDashboardKpis,
  getDeviceChartSeries,
  getLatestTelemetry,
  getModelSummaries,
  getRecentCriticalAlerts,
  getRecentValveActivity,
} from '../src/utils/dashboardSelectors.js'

const state = createInitialAppState()
const latestRecordedAt = Math.max(
  ...state.telemetry.map(({ recordedAt }) => new Date(recordedAt).getTime()),
)
const kpis = getDashboardKpis(state, latestRecordedAt)

assert.equal(kpis.totalDevices, 3)
assert.equal(kpis.onlineDevices, 1)
assert.equal(kpis.activeAlerts, 2)
assert.ok(kpis.todayUsage > 0)

const modelSummaries = getModelSummaries(state.devices)
const lpg365Summary = modelSummaries.find(({ model }) => model === 'LPG365')
const lpg365pSummary = modelSummaries.find(({ model }) => model === 'LPG365-P')

assert.equal(lpg365Summary.total, 1)
assert.equal(lpg365pSummary.total, 2)

const lpg365 = state.devices.find(({ model }) => model === 'LPG365')
const lpg365p = state.devices.find(({ model }) => model === 'LPG365-P')
const temperatureSeries = getDeviceChartSeries(state.telemetry, lpg365)
const pressureSeries = getDeviceChartSeries(state.telemetry, lpg365p)

assert.equal(temperatureSeries.records.length, 24)
assert.equal(temperatureSeries.secondaryKey, 'temperature')
assert.equal(temperatureSeries.secondaryUnit, '°C')
assert.ok(temperatureSeries.records.every((record) => (
  Object.hasOwn(record, 'temperature') && !Object.hasOwn(record, 'pressure')
)))

assert.equal(pressureSeries.records.length, 24)
assert.equal(pressureSeries.secondaryKey, 'pressure')
assert.equal(pressureSeries.secondaryUnit, 'PSI')
assert.ok(pressureSeries.records.every((record) => (
  Object.hasOwn(record, 'pressure') && !Object.hasOwn(record, 'temperature')
)))

assert.ok(getDailyUsageSeries(state.telemetry, lpg365.id).length >= 5)
assert.ok(getDailyUsageSeries(state.telemetry, lpg365p.id).length >= 5)
assert.equal(getLatestTelemetry(state.telemetry, lpg365.id).deviceId, lpg365.id)

const criticalAlerts = getRecentCriticalAlerts(state.alerts)
assert.ok(criticalAlerts.length > 0)
assert.ok(criticalAlerts.every(({ severity }) => severity === 'CRITICAL'))

const recentValveActivity = getRecentValveActivity(state.valveCommands)
assert.ok(recentValveActivity.length > 0)
assert.ok(
  new Date(recentValveActivity[0].createdAt).getTime()
    >= new Date(recentValveActivity.at(-1).createdAt).getTime(),
)

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    kpisFromSharedState: true,
    modelSummary: true,
    flowWindow: true,
    lpg365TemperatureOnly: true,
    lpg365pPressureOnly: true,
    dailyUsage: true,
    recentActivity: true,
  },
}, null, 2))
