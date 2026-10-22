import { APP_TIME_ZONE } from './formatters.js'

export const DEVICE_HISTORY_RANGES = Object.freeze({
  '24H': Object.freeze({ label: '24 ชั่วโมง', points: 24 }),
  '7D': Object.freeze({ label: '7 วัน', points: 7 * 24 }),
  '30D': Object.freeze({ label: '30 วัน', points: 30 * 24 }),
})

function toTimestamp(value) {
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function formatChartLabel(value, range) {
  const options = range === '24H'
    ? { hour: '2-digit', minute: '2-digit' }
    : range === '7D'
      ? { weekday: 'short', hour: '2-digit' }
      : { day: 'numeric', month: 'short' }

  return new Intl.DateTimeFormat('th-TH', {
    timeZone: APP_TIME_ZONE,
    ...options,
  }).format(new Date(value))
}

function sampleRecords(records, maximumPoints = 120) {
  if (records.length <= maximumPoints) {
    return records
  }

  const step = (records.length - 1) / (maximumPoints - 1)

  return Array.from(
    { length: maximumPoints },
    (_, index) => records[Math.round(index * step)],
  )
}

export function getDeviceHistorySeries(telemetry, device, range = '24H') {
  const rangeConfig = DEVICE_HISTORY_RANGES[range] ?? DEVICE_HISTORY_RANGES['24H']
  const deviceRecords = telemetry
    .filter((record) => record.deviceId === device?.id)
    .toSorted((left, right) => (
      toTimestamp(left.recordedAt) - toTimestamp(right.recordedAt)
    ))
    .slice(-rangeConfig.points)
  const secondaryKey = device?.capabilities.temperature ? 'temperature' : 'pressure'

  return {
    range,
    sourceRecordCount: deviceRecords.length,
    secondaryKey,
    secondaryLabel: secondaryKey === 'temperature' ? 'Water Temperature' : 'Water Pressure',
    secondaryUnit: secondaryKey === 'temperature' ? '°C' : 'PSI',
    records: sampleRecords(deviceRecords).map((record) => ({
      ...record,
      chartLabel: formatChartLabel(record.recordedAt, range),
    })),
  }
}

export function getDeviceSensors(leakSensors, deviceId) {
  return leakSensors.filter((sensor) => sensor.deviceId === deviceId)
}

export function getDeviceAlerts(alerts, deviceId, limit = 10) {
  return alerts
    .filter((alert) => alert.deviceId === deviceId)
    .toSorted((left, right) => (
      toTimestamp(right.createdAt) - toTimestamp(left.createdAt)
    ))
    .slice(0, limit)
}

export function getDeviceValveHistory(valveCommands, deviceId, limit = 10) {
  return valveCommands
    .filter((command) => command.deviceId === deviceId)
    .toSorted((left, right) => (
      toTimestamp(right.createdAt) - toTimestamp(left.createdAt)
    ))
    .slice(0, limit)
}
