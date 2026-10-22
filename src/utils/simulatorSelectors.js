export const SIMULATION_INTERVAL_MS = 4000
export const MAX_VISIBLE_SIMULATION_EVENTS = 20

const FLOW_DELTAS = Object.freeze([0.03, 0.02, -0.01, 0.04, -0.03, -0.05])
const TEMPERATURE_DELTAS = Object.freeze([0.1, 0.2, -0.1, 0, -0.2, 0])
const PRESSURE_DELTAS = Object.freeze([0.4, -0.2, 0.3, -0.1, -0.3, -0.1])
const LITERS_PER_GALLON = 3.78541

function round(value, digits) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function getLatestDeviceTelemetry(telemetry, deviceId) {
  return telemetry.reduce((latest, record) => {
    if (record.deviceId !== deviceId) {
      return latest
    }

    if (!latest || new Date(record.recordedAt).getTime() > new Date(latest.recordedAt).getTime()) {
      return record
    }

    return latest
  }, null)
}

export function createNextTelemetryValues(
  device,
  latestTelemetry,
  tickIndex,
  intervalMs = SIMULATION_INTERVAL_MS,
) {
  const patternIndex = tickIndex % FLOW_DELTAS.length
  const previousFlow = Number(latestTelemetry?.flowRate ?? 0.2)
  const flowRate = round(clamp(previousFlow + FLOW_DELTAS[patternIndex], 0.02, 1.2), 2)
  const previousUsage = Number(latestTelemetry?.usageTotal ?? 0)
  const usageIncrease = flowRate * LITERS_PER_GALLON * (intervalMs / 60000)
  const values = {
    flowRate,
    usageTotal: round(previousUsage + usageIncrease, 3),
  }

  if (device.capabilities.temperature) {
    values.temperature = round(
      clamp(
        Number(latestTelemetry?.temperature ?? 27) + TEMPERATURE_DELTAS[patternIndex],
        1,
        70,
      ),
      1,
    )
  }

  if (device.capabilities.pressure) {
    values.pressure = round(
      clamp(
        Number(latestTelemetry?.pressure ?? 58) + PRESSURE_DELTAS[patternIndex],
        0,
        120,
      ),
      1,
    )
  }

  return values
}

export function getDeviceSimulationEvents(eventLog, deviceId, limit = MAX_VISIBLE_SIMULATION_EVENTS) {
  return eventLog
    .filter((event) => event.deviceId === deviceId)
    .sort((left, right) => (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    ))
    .slice(0, limit)
}

export function getDeviceSimulationSensors(leakSensors, deviceId) {
  return leakSensors.filter((sensor) => sensor.deviceId === deviceId)
}
