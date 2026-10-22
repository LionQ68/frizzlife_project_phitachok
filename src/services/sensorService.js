import { canUserAccessDevice } from './authService.js'

function failure(appState, code, message) {
  return {
    state: appState,
    result: { success: false, code, message },
  }
}

export function updateSensorDetails(appState, sensorId, changes, user) {
  const sensor = appState.leakSensors.find(({ id }) => id === sensorId)

  if (!sensor) {
    return failure(appState, 'SENSOR_NOT_FOUND', 'ไม่พบ Sensor ที่ต้องการแก้ไข')
  }

  if (!canUserAccessDevice(user, sensor.deviceId)) {
    return failure(
      appState,
      'DEVICE_ACCESS_DENIED',
      'บัญชีนี้ไม่มีสิทธิ์แก้ไข Sensor ของอุปกรณ์ดังกล่าว',
    )
  }

  const name = String(changes?.name ?? '').trim()
  const zone = String(changes?.zone ?? '').trim()

  if (!name || !zone) {
    return failure(
      appState,
      'INVALID_SENSOR_DETAILS',
      'กรุณากรอกชื่อและตำแหน่งติดตั้ง Sensor ให้ครบถ้วน',
    )
  }

  const now = new Date().toISOString()
  const updatedSensor = { ...sensor, name, zone }
  const nextState = {
    ...appState,
    leakSensors: appState.leakSensors.map((item) => (
      item.id === sensorId ? updatedSensor : item
    )),
    updatedAt: now,
  }

  return {
    state: nextState,
    result: {
      success: true,
      code: 'SENSOR_UPDATED',
      message: 'บันทึกชื่อและตำแหน่ง Sensor แล้ว',
      sensor: updatedSensor,
    },
  }
}
