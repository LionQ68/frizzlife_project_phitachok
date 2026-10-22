import {
  getDailyUsageSeries,
  getLatestTelemetry,
  isActiveAlert,
} from './dashboardSelectors.js'
import {
  getDeviceAlerts,
  getDeviceSensors,
  getDeviceValveHistory,
} from './deviceDetailSelectors.js'

export function getUserDashboardData(appState, visibleDevices, selectedDeviceId) {
  const visibleDeviceIds = new Set(visibleDevices.map(({ id }) => id))
  const device = visibleDevices.find(({ id }) => id === selectedDeviceId)
    ?? visibleDevices[0]
    ?? null

  if (!device) {
    return {
      device: null,
      latestTelemetry: null,
      sensors: [],
      alerts: [],
      valveHistory: [],
      usageSeries: [],
      hasActiveLeak: false,
      hasActiveCriticalAlert: false,
      personalAlertCount: 0,
    }
  }

  const personalAlerts = appState.alerts.filter(
    (alert) => visibleDeviceIds.has(alert.deviceId),
  )
  const sensors = getDeviceSensors(appState.leakSensors, device.id)
  const allDeviceAlerts = personalAlerts.filter(
    (alert) => alert.deviceId === device.id,
  )
  const deviceAlerts = getDeviceAlerts(personalAlerts, device.id, 6)

  return {
    device,
    latestTelemetry: getLatestTelemetry(appState.telemetry, device.id),
    sensors,
    alerts: deviceAlerts,
    valveHistory: getDeviceValveHistory(appState.valveCommands, device.id, 6),
    usageSeries: getDailyUsageSeries(appState.telemetry, device.id),
    hasActiveLeak: sensors.some(({ status }) => status === 'LEAK'),
    hasActiveCriticalAlert: allDeviceAlerts.some(
      (alert) => alert.severity === 'CRITICAL' && isActiveAlert(alert),
    ),
    personalAlertCount: personalAlerts.filter(isActiveAlert).length,
  }
}
