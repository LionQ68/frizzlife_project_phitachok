const now = Date.now()

const sensorLocations = [
  { key: 'kitchen', name: 'Kitchen Sensor', zone: 'ใต้ซิงก์ครัว' },
  { key: 'bathroom', name: 'Bathroom Sensor', zone: 'ห้องน้ำ' },
  { key: 'utility', name: 'Utility Sensor', zone: 'ห้องซักล้าง' },
]

const deviceSensorSettings = {
  'device-365-001': {
    status: 'NORMAL',
    lastSeenMinutesAgo: 1,
    batteries: [92, 86, 78],
    signals: [-48, -55, -61],
  },
  'device-365p-001': {
    status: 'NORMAL',
    lastSeenMinutesAgo: 2,
    batteries: [88, 14, 73],
    signals: [-44, -58, -63],
  },
  'device-365p-002': {
    status: 'OFFLINE',
    lastSeenMinutesAgo: 18,
    batteries: [67, 59, 81],
    signals: [-76, -79, -74],
  },
}

export const leakSensors = Object.entries(deviceSensorSettings).flatMap(
  ([deviceId, settings]) => sensorLocations.map((sensor, index) => ({
    id: `${deviceId}-sensor-${sensor.key}`,
    deviceId,
    name: sensor.name,
    zone: sensor.zone,
    status: settings.status,
    batteryLevel: settings.batteries[index],
    signalStrength: settings.signals[index],
    lastSeenAt: new Date(
      now - settings.lastSeenMinutesAgo * 60 * 1000 - index * 15 * 1000,
    ).toISOString(),
    isMock: true,
  })),
)
