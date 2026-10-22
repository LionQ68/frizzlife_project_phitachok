export const ALERT_TYPE_LABELS = Object.freeze({
  MICRO_LEAK: 'Micro Leak',
  SENSOR_LEAK: 'Sensor Leak',
  ABNORMAL_FLOW: 'Abnormal Flow',
  TEMPERATURE: 'Temperature',
  PRESSURE: 'Pressure',
  OFFLINE: 'Device Offline',
  LOW_BATTERY: 'Low Battery',
})

export const ALERT_SEVERITIES = Object.freeze(['CRITICAL', 'WARNING', 'INFO'])
export const ALERT_STATUSES = Object.freeze(['OPEN', 'ACKNOWLEDGED', 'RESOLVED'])

const VALVE_ACTION_WINDOW_MS = 2 * 60 * 1000

export const DEFAULT_ALERT_FILTERS = Object.freeze({
  severity: 'ALL',
  type: 'ALL',
  status: 'ALL',
  deviceId: 'ALL',
  model: 'ALL',
})

function getRelatedValveCommand(alert, valveCommands) {
  const alertTime = new Date(alert.createdAt).getTime()

  if (!Number.isFinite(alertTime)) {
    return null
  }

  return valveCommands
    .filter((command) => (
      command.deviceId === alert.deviceId
      && command.source === 'AUTOMATION'
      && Math.abs(new Date(command.createdAt).getTime() - alertTime) <= VALVE_ACTION_WINDOW_MS
    ))
    .sort((left, right) => (
      Math.abs(new Date(left.createdAt).getTime() - alertTime)
      - Math.abs(new Date(right.createdAt).getTime() - alertTime)
    ))[0] ?? null
}

export function isAlertTypeSupportedByDevice(device, type) {
  if (!device) {
    return false
  }

  if (type === 'TEMPERATURE') {
    return device.capabilities.temperature
  }

  if (type === 'PRESSURE') {
    return device.capabilities.pressure
  }

  return true
}

export function createAlertListItems({
  alerts,
  devices,
  leakSensors,
  valveCommands,
  users,
}) {
  const deviceById = new Map(devices.map((device) => [device.id, device]))
  const sensorById = new Map(leakSensors.map((sensor) => [sensor.id, sensor]))
  const userById = new Map(users.map((user) => [user.id, user]))

  return alerts
    .map((alert) => ({
      alert,
      device: deviceById.get(alert.deviceId) ?? null,
      sensor: alert.sensorId ? sensorById.get(alert.sensorId) ?? null : null,
      valveCommand: getRelatedValveCommand(alert, valveCommands),
      acknowledgedByUser: alert.acknowledgedBy
        ? userById.get(alert.acknowledgedBy) ?? null
        : null,
      resolvedByUser: alert.resolvedBy
        ? userById.get(alert.resolvedBy) ?? null
        : null,
    }))
    .sort((left, right) => (
      new Date(right.alert.createdAt).getTime()
      - new Date(left.alert.createdAt).getTime()
    ))
}

export function filterAlertItems(items, filters) {
  return items.filter(({ alert, device }) => (
    (filters.severity === 'ALL' || alert.severity === filters.severity)
    && (filters.type === 'ALL' || alert.type === filters.type)
    && (filters.status === 'ALL' || alert.status === filters.status)
    && (filters.deviceId === 'ALL' || alert.deviceId === filters.deviceId)
    && (filters.model === 'ALL' || device?.model === filters.model)
  ))
}

export function getAlertSummary(alerts) {
  return {
    active: alerts.filter(({ status }) => status !== 'RESOLVED').length,
    critical: alerts.filter((alert) => (
      alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED'
    )).length,
    acknowledged: alerts.filter(({ status }) => status === 'ACKNOWLEDGED').length,
    resolved: alerts.filter(({ status }) => status === 'RESOLVED').length,
  }
}

export function hasActiveAlertFilters(filters) {
  return Object.values(filters).some((value) => value !== 'ALL')
}
