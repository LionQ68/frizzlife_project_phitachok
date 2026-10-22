export const DEVICE_MODELS = Object.freeze({
  LPG365: 'LPG365',
  LPG365_P: 'LPG365-P',
})

const MODEL_CAPABILITIES = Object.freeze({
  [DEVICE_MODELS.LPG365]: Object.freeze({
    flow: true,
    usage: true,
    temperature: true,
    pressure: false,
    leakSensors: true,
    valveControl: true,
  }),
  [DEVICE_MODELS.LPG365_P]: Object.freeze({
    flow: true,
    usage: true,
    temperature: false,
    pressure: true,
    leakSensors: true,
    valveControl: true,
  }),
})

export function getDeviceCapabilities(deviceOrModel) {
  const model = typeof deviceOrModel === 'string'
    ? deviceOrModel
    : deviceOrModel?.model
  const capabilities = MODEL_CAPABILITIES[model]

  if (!capabilities) {
    throw new Error(`ไม่พบข้อมูลความสามารถของอุปกรณ์รุ่น: ${model ?? 'ไม่ระบุ'}`)
  }

  return { ...capabilities }
}

export function supportsCapability(deviceOrModel, capability) {
  return getDeviceCapabilities(deviceOrModel)[capability] === true
}

export function getModelSpecificMetric(deviceOrModel) {
  const capabilities = getDeviceCapabilities(deviceOrModel)

  if (capabilities.temperature) {
    return 'temperature'
  }

  if (capabilities.pressure) {
    return 'pressure'
  }

  return null
}
