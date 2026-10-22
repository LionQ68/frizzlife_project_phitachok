import { getLatestTelemetry } from './dashboardSelectors.js'

function normalizeSearchValue(value) {
  return String(value ?? '').trim().toLocaleLowerCase('th-TH')
}

export function filterDevices(devices, filters = {}) {
  const query = normalizeSearchValue(filters.query)
  const status = filters.status ?? 'ALL'
  const model = filters.model ?? 'ALL'

  return devices.filter((device) => {
    const matchesQuery = !query || [
      device.serialNumber,
      device.name,
      device.customerName,
      device.location,
    ].some((value) => normalizeSearchValue(value).includes(query))
    const matchesStatus = status === 'ALL' || device.status === status
    const matchesModel = model === 'ALL' || device.model === model

    return matchesQuery && matchesStatus && matchesModel
  })
}

export function createDeviceListItems(devices, telemetry, users) {
  return devices.map((device) => ({
    device,
    latestTelemetry: getLatestTelemetry(telemetry, device.id),
    assignedUser: users.find(({ id }) => id === device.assignedUserId) ?? null,
  }))
}
