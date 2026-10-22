import { devices } from './devices.js'

const now = Date.now()
const HOUR_IN_MS = 60 * 60 * 1000
const TELEMETRY_POINTS_PER_DEVICE = 30 * 24

const telemetryProfiles = {
  'device-365-001': {
    flowBase: 1.2,
    usageStart: 1482,
    temperatureBase: 27.4,
    latestOffsetMinutes: 1,
  },
  'device-365p-001': {
    flowBase: 0.9,
    usageStart: 1168,
    pressureBase: 58,
    latestOffsetMinutes: 2,
  },
  'device-365p-002': {
    flowBase: 0,
    usageStart: 932,
    pressureBase: 55,
    latestOffsetMinutes: 18,
  },
}

function createTelemetryRecord(device, profile, pointIndex) {
  const isLatestPoint = pointIndex === TELEMETRY_POINTS_PER_DEVICE - 1
  const hoursAgo = TELEMETRY_POINTS_PER_DEVICE - 1 - pointIndex
  const wave = Math.sin(pointIndex / 2.2)
  const flowRate = device.status === 'OFFLINE' && isLatestPoint
    ? 0
    : Math.max(0, profile.flowBase + wave * 0.45)
  const recordedAt = isLatestPoint
    ? now - profile.latestOffsetMinutes * 60 * 1000
    : now - hoursAgo * HOUR_IN_MS
  const record = {
    id: `${device.id}-telemetry-${String(pointIndex + 1).padStart(2, '0')}`,
    deviceId: device.id,
    flowRate: Number(flowRate.toFixed(2)),
    usageTotal: Number((profile.usageStart + pointIndex * 7.6).toFixed(1)),
    usageUnit: 'LITERS',
    recordedAt: new Date(recordedAt).toISOString(),
    isMock: true,
  }

  if (device.capabilities.temperature) {
    record.temperature = Number((profile.temperatureBase + wave * 0.8).toFixed(1))
  }

  if (device.capabilities.pressure) {
    record.pressure = Number((profile.pressureBase + wave * 2.6).toFixed(1))
  }

  return record
}

export const telemetry = devices.flatMap((device) => {
  const profile = telemetryProfiles[device.id]

  return Array.from(
    { length: TELEMETRY_POINTS_PER_DEVICE },
    (_, index) => createTelemetryRecord(device, profile, index),
  )
})

export function getLatestTelemetry(deviceId) {
  return telemetry.findLast((record) => record.deviceId === deviceId) ?? null
}
