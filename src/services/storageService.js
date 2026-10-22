import {
  alerts,
  devices,
  leakSensors,
  telemetry,
  users,
  valveCommands,
} from '../data/index.js'

export const STORAGE_KEYS = Object.freeze({
  appState: 'frizzlife-demo-state-v1',
  session: 'frizzlife-demo-session-v1',
})

const SCHEMA_VERSION = 2

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function getDefaultStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function hasValidAppStateShape(value) {
  return value?.schemaVersion === SCHEMA_VERSION
    && Array.isArray(value.users)
    && Array.isArray(value.devices)
    && Array.isArray(value.leakSensors)
    && Array.isArray(value.telemetry)
    && Array.isArray(value.alerts)
    && Array.isArray(value.valveCommands)
    && Array.isArray(value.eventLog)
}

export function createInitialAppState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    users: cloneValue(users),
    devices: cloneValue(devices),
    leakSensors: cloneValue(leakSensors),
    telemetry: cloneValue(telemetry),
    alerts: cloneValue(alerts),
    valveCommands: cloneValue(valveCommands),
    eventLog: [],
    updatedAt: new Date().toISOString(),
  }
}

export function loadAppState(storage = getDefaultStorage()) {
  if (!storage) {
    return createInitialAppState()
  }

  try {
    const savedState = storage.getItem(STORAGE_KEYS.appState)

    if (!savedState) {
      return createInitialAppState()
    }

    const parsedState = JSON.parse(savedState)
    return hasValidAppStateShape(parsedState)
      ? parsedState
      : createInitialAppState()
  } catch {
    return createInitialAppState()
  }
}

export function saveAppState(appState, storage = getDefaultStorage()) {
  if (!storage) {
    return false
  }

  try {
    storage.setItem(STORAGE_KEYS.appState, JSON.stringify(appState))
    return true
  } catch {
    return false
  }
}

export function resetDemoData(storage = getDefaultStorage()) {
  const initialState = createInitialAppState()
  saveAppState(initialState, storage)
  return initialState
}

export function loadSession(storage = getDefaultStorage()) {
  if (!storage) {
    return null
  }

  try {
    const savedSession = storage.getItem(STORAGE_KEYS.session)
    return savedSession ? JSON.parse(savedSession) : null
  } catch {
    return null
  }
}

export function saveSession(user, storage = getDefaultStorage()) {
  if (!storage || !user) {
    return false
  }

  const session = {
    userId: user.id,
    role: user.role,
    createdAt: new Date().toISOString(),
  }

  try {
    storage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
    return true
  } catch {
    return false
  }
}

export function clearSession(storage = getDefaultStorage()) {
  if (!storage) {
    return false
  }

  try {
    storage.removeItem(STORAGE_KEYS.session)
    return true
  } catch {
    return false
  }
}
