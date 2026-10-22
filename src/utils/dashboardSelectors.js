import { APP_TIME_ZONE } from './formatters.js'

const ACTIVE_ALERT_STATUSES = new Set(['OPEN', 'ACKNOWLEDGED'])
const FLOW_WINDOW_SIZE = 24

function toTimestamp(value) {
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function getBangkokDateKey(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getDateLabel(dateKey) {
  if (!dateKey) {
    return 'ไม่มีวันที่'
  }

  return new Intl.DateTimeFormat('th-TH', {
    timeZone: APP_TIME_ZONE,
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${dateKey}T12:00:00+07:00`))
}

function getTimeLabel(value) {
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: APP_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function isActiveAlert(alert) {
  return ACTIVE_ALERT_STATUSES.has(alert.status)
}

export function getTelemetryForDevice(telemetry, deviceId) {
  return telemetry
    .filter((record) => record.deviceId === deviceId)
    .toSorted((left, right) => (
      toTimestamp(left.recordedAt) - toTimestamp(right.recordedAt)
    ))
}

export function getLatestTelemetry(telemetry, deviceId) {
  return getTelemetryForDevice(telemetry, deviceId).at(-1) ?? null
}

export function getDashboardKpis({ devices, alerts, telemetry }, referenceTime = Date.now()) {
  const todayKey = getBangkokDateKey(referenceTime)
  const todayUsage = devices.reduce((total, device) => {
    const records = getTelemetryForDevice(telemetry, device.id)
    let deviceUsage = 0

    for (let index = 1; index < records.length; index += 1) {
      const current = records[index]
      const previous = records[index - 1]

      if (getBangkokDateKey(current.recordedAt) !== todayKey) {
        continue
      }

      deviceUsage += Math.max(0, current.usageTotal - previous.usageTotal)
    }

    return total + deviceUsage
  }, 0)

  return {
    totalDevices: devices.length,
    onlineDevices: devices.filter(({ status }) => status === 'ONLINE').length,
    activeAlerts: alerts.filter(isActiveAlert).length,
    todayUsage: Number(todayUsage.toFixed(1)),
  }
}

export function getModelSummaries(devices) {
  return ['LPG365', 'LPG365-P'].map((model) => {
    const modelDevices = devices.filter((device) => device.model === model)

    return {
      model,
      total: modelDevices.length,
      online: modelDevices.filter(({ status }) => status === 'ONLINE').length,
      warning: modelDevices.filter(({ status }) => status === 'WARNING').length,
      offline: modelDevices.filter(({ status }) => status === 'OFFLINE').length,
    }
  })
}

export function getDeviceChartSeries(telemetry, device) {
  if (!device) {
    return {
      records: [],
      secondaryKey: null,
      secondaryLabel: '',
      secondaryUnit: '',
    }
  }

  const records = getTelemetryForDevice(telemetry, device.id)
    .slice(-FLOW_WINDOW_SIZE)
    .map((record) => ({
      ...record,
      timeLabel: getTimeLabel(record.recordedAt),
    }))
  const hasTemperature = device.capabilities.temperature === true

  return {
    records,
    secondaryKey: hasTemperature ? 'temperature' : 'pressure',
    secondaryLabel: hasTemperature ? 'อุณหภูมิน้ำ' : 'แรงดันน้ำ',
    secondaryUnit: hasTemperature ? '°C' : 'PSI',
  }
}

export function getDailyUsageSeries(telemetry, deviceId) {
  const records = getTelemetryForDevice(telemetry, deviceId)
  const usageByDay = new Map()

  for (let index = 1; index < records.length; index += 1) {
    const current = records[index]
    const previous = records[index - 1]
    const dateKey = getBangkokDateKey(current.recordedAt)

    if (!dateKey) {
      continue
    }

    const usageDelta = Math.max(0, current.usageTotal - previous.usageTotal)
    usageByDay.set(dateKey, (usageByDay.get(dateKey) ?? 0) + usageDelta)
  }

  return [...usageByDay.entries()]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([dateKey, usage]) => ({
      dateKey,
      dateLabel: getDateLabel(dateKey),
      usage: Number(usage.toFixed(1)),
    }))
}

export function getRecentCriticalAlerts(alerts, limit = 4) {
  return alerts
    .filter(({ severity }) => severity === 'CRITICAL')
    .toSorted((left, right) => (
      toTimestamp(right.createdAt) - toTimestamp(left.createdAt)
    ))
    .slice(0, limit)
}

export function getRecentValveActivity(valveCommands, limit = 5) {
  return valveCommands
    .toSorted((left, right) => (
      toTimestamp(right.createdAt) - toTimestamp(left.createdAt)
    ))
    .slice(0, limit)
}
