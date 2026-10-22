import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AppContext } from './AppContext.js'
import {
  acknowledgeAlert,
  addDevice,
  addUser,
  advanceTelemetry,
  appendTelemetry,
  getDevicesForUser,
  getPublicUser,
  loadAppState,
  login,
  logout,
  requestAuthorizedValveCommand,
  resetDemoData as resetStoredDemoData,
  resolveAlert,
  restoreSessionUser,
  saveAppState,
  simulateAbnormalTemperature,
  simulateHighPressure,
  simulateLeak,
  simulateLeakResolved,
  simulateOffline,
  updateDevice,
  updateUser,
  updateSensorDetails,
} from '../services/index.js'
import { SIMULATION_INTERVAL_MS } from '../utils/simulatorSelectors.js'

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(loadAppState)
  const appStateRef = useRef(appState)
  const telemetryTickRef = useRef(0)
  const [currentUser, setCurrentUser] = useState(
    () => restoreSessionUser(appState.users),
  )

  useEffect(() => {
    appStateRef.current = appState
    saveAppState(appState)
  }, [appState])

  const commitStateChange = useCallback((operation) => {
    const outcome = operation(appStateRef.current)
    appStateRef.current = outcome.state
    setAppState(outcome.state)
    return outcome.result
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextTick = telemetryTickRef.current + 1
      telemetryTickRef.current = nextTick
      commitStateChange((state) => advanceTelemetry(state, nextTick))
    }, SIMULATION_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [commitStateChange])

  const loginUser = useCallback((credentials) => {
    const result = login(appStateRef.current.users, credentials)

    if (result.success) {
      setCurrentUser(result.user)
    }

    return result
  }, [])

  const logoutUser = useCallback(() => {
    const result = logout()
    setCurrentUser(null)
    return result
  }, [])

  const addDeviceAction = useCallback(
    (input) => commitStateChange((state) => addDevice(state, input)),
    [commitStateChange],
  )

  const updateDeviceAction = useCallback(
    (deviceId, changes) => commitStateChange(
      (state) => updateDevice(state, deviceId, changes),
    ),
    [commitStateChange],
  )

  const addUserAction = useCallback(
    (input) => commitStateChange((state) => addUser(state, input)),
    [commitStateChange],
  )

  const updateUserAction = useCallback(
    (userId, changes) => commitStateChange(
      (state) => updateUser(state, userId, changes),
    ),
    [commitStateChange],
  )

  const acknowledgeAlertAction = useCallback(
    (alertId) => commitStateChange(
      (state) => acknowledgeAlert(state, alertId, currentUser?.id ?? 'SYSTEM'),
    ),
    [commitStateChange, currentUser],
  )

  const resolveAlertAction = useCallback(
    (alertId, resolutionNote) => commitStateChange(
      (state) => resolveAlert(
        state,
        alertId,
        currentUser?.id ?? 'SYSTEM',
        resolutionNote,
      ),
    ),
    [commitStateChange, currentUser],
  )

  const requestValveAction = useCallback(
    (deviceId, command, reason) => commitStateChange(
      (state) => requestAuthorizedValveCommand(state, deviceId, {
        command,
        reason,
      }, state.users.find(({ id }) => id === currentUser?.id) ?? currentUser),
    ),
    [commitStateChange, currentUser],
  )

  const updateSensorAction = useCallback(
    (sensorId, changes) => commitStateChange(
      (state) => updateSensorDetails(
        state,
        sensorId,
        changes,
        state.users.find(({ id }) => id === currentUser?.id) ?? currentUser,
      ),
    ),
    [commitStateChange, currentUser],
  )

  const simulateLeakAction = useCallback(
    (deviceId, sensorId) => commitStateChange(
      (state) => simulateLeak(state, deviceId, sensorId),
    ),
    [commitStateChange],
  )

  const simulateLeakResolvedAction = useCallback(
    (deviceId, sensorId) => commitStateChange(
      (state) => simulateLeakResolved(
        state,
        deviceId,
        sensorId,
        state.users.find(({ id }) => id === currentUser?.id) ?? currentUser,
      ),
    ),
    [commitStateChange, currentUser],
  )

  const simulateOfflineAction = useCallback(
    (deviceId) => commitStateChange(
      (state) => simulateOffline(state, deviceId),
    ),
    [commitStateChange],
  )

  const simulateTemperatureAction = useCallback(
    (deviceId) => commitStateChange(
      (state) => simulateAbnormalTemperature(state, deviceId),
    ),
    [commitStateChange],
  )

  const simulatePressureAction = useCallback(
    (deviceId) => commitStateChange(
      (state) => simulateHighPressure(state, deviceId),
    ),
    [commitStateChange],
  )

  const appendTelemetryAction = useCallback(
    (deviceId, values) => commitStateChange(
      (state) => appendTelemetry(state, deviceId, values),
    ),
    [commitStateChange],
  )

  const resetDemoDataAction = useCallback(() => {
    const initialState = resetStoredDemoData()
    telemetryTickRef.current = 0
    appStateRef.current = initialState
    setAppState(initialState)
    setCurrentUser(restoreSessionUser(initialState.users))

    return {
      success: true,
      code: 'DEMO_DATA_RESET',
      message: 'คืนข้อมูลจำลองเริ่มต้นแล้ว โดยยังคง Session ปัจจุบัน',
    }
  }, [])

  const activeUser = useMemo(() => {
    if (!currentUser) {
      return null
    }

    const latestUser = appState.users.find(({ id }) => id === currentUser.id)
    return latestUser ? getPublicUser(latestUser) : null
  }, [appState.users, currentUser])

  const visibleDevices = useMemo(
    () => getDevicesForUser(appState, activeUser),
    [activeUser, appState],
  )

  const contextValue = useMemo(() => ({
    ...appState,
    currentUser: activeUser,
    visibleDevices,
    login: loginUser,
    logout: logoutUser,
    addDevice: addDeviceAction,
    updateDevice: updateDeviceAction,
    addUser: addUserAction,
    updateUser: updateUserAction,
    acknowledgeAlert: acknowledgeAlertAction,
    resolveAlert: resolveAlertAction,
    requestValveCommand: requestValveAction,
    updateSensor: updateSensorAction,
    simulateLeak: simulateLeakAction,
    simulateLeakResolved: simulateLeakResolvedAction,
    simulateOffline: simulateOfflineAction,
    simulateAbnormalTemperature: simulateTemperatureAction,
    simulateHighPressure: simulatePressureAction,
    appendTelemetry: appendTelemetryAction,
    resetDemoData: resetDemoDataAction,
  }), [
    acknowledgeAlertAction,
    addDeviceAction,
    addUserAction,
    appendTelemetryAction,
    appState,
    activeUser,
    loginUser,
    logoutUser,
    requestValveAction,
    resetDemoDataAction,
    resolveAlertAction,
    simulateLeakAction,
    simulateLeakResolvedAction,
    simulateOfflineAction,
    simulatePressureAction,
    simulateTemperatureAction,
    updateDeviceAction,
    updateUserAction,
    updateSensorAction,
    visibleDevices,
  ])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
