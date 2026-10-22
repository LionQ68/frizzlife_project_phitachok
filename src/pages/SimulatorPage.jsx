import { RotateCcw, ShieldCheck } from 'lucide-react'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { PageState } from '../components/PageState.jsx'
import { ResetSimulationModal } from '../components/ResetSimulationModal.jsx'
import { SimulationControls } from '../components/SimulationControls.jsx'
import { SimulationEventLog } from '../components/SimulationEventLog.jsx'
import { SimulatorDevicePanel } from '../components/SimulatorDevicePanel.jsx'
import { useAppContext } from '../context/useAppContext.js'
import {
  getDeviceSimulationEvents,
  getDeviceSimulationSensors,
  getLatestDeviceTelemetry,
} from '../utils/simulatorSelectors.js'

export function SimulatorPage() {
  const {
    devices,
    leakSensors,
    telemetry,
    eventLog,
    simulateLeak,
    simulateLeakResolved,
    simulateOffline,
    simulateAbnormalTemperature,
    simulateHighPressure,
    resetDemoData,
  } = useAppContext()
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => devices[0]?.id ?? '')
  const [selectedSensorId, setSelectedSensorId] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showResetModal, setShowResetModal] = useState(false)

  const selectedDevice = useMemo(
    () => devices.find(({ id }) => id === selectedDeviceId) ?? devices[0] ?? null,
    [devices, selectedDeviceId],
  )
  const selectedSensors = useMemo(
    () => getDeviceSimulationSensors(leakSensors, selectedDevice?.id),
    [leakSensors, selectedDevice?.id],
  )
  const latestTelemetry = useMemo(
    () => getLatestDeviceTelemetry(telemetry, selectedDevice?.id),
    [selectedDevice?.id, telemetry],
  )
  const selectedEvents = useMemo(
    () => getDeviceSimulationEvents(eventLog, selectedDevice?.id),
    [eventLog, selectedDevice?.id],
  )
  const effectiveSensorId = selectedSensors.some(({ id }) => id === selectedSensorId)
    ? selectedSensorId
    : selectedSensors[0]?.id ?? ''

  const closeResetModal = useCallback(() => setShowResetModal(false), [])

  if (!selectedDevice) {
    return (
      <section className="simulator-page">
        <PageState
          type="empty"
          title="ยังไม่มีอุปกรณ์สำหรับจำลอง"
          description="เพิ่มอุปกรณ์จากหน้าจัดการอุปกรณ์ก่อนเปิดตัวจำลอง"
          action={<Link className="primary-link" to="/admin/devices">ไปหน้าจัดการอุปกรณ์</Link>}
        />
      </section>
    )
  }

  const showResult = (result) => {
    setFeedback({ success: result.success, message: result.message })
    return result
  }

  const handleSimulateLeak = () => showResult(
    simulateLeak(selectedDevice.id, effectiveSensorId),
  )

  const handleSimulateLeakResolved = () => showResult(
    simulateLeakResolved(selectedDevice.id, effectiveSensorId),
  )

  const handleSimulateOffline = () => showResult(
    simulateOffline(selectedDevice.id),
  )

  const handleSpecificMetric = () => showResult(
    selectedDevice.capabilities.temperature
      ? simulateAbnormalTemperature(selectedDevice.id)
      : simulateHighPressure(selectedDevice.id),
  )

  const handleReset = () => {
    const result = resetDemoData()
    setSelectedDeviceId('device-365-001')
    setSelectedSensorId('')
    setFeedback({ success: result.success, message: result.message })
    closeResetModal()
  }

  return (
    <section className="simulator-page">
      <div className="simulator-heading">
        <div>
          <span className="devices-eyebrow">DEMO CONTROL · LOCAL SIMULATION</span>
          <h2>Device Simulator</h2>
          <p>จำลอง Telemetry และเหตุการณ์ของ LPG365 Series ภายใน Browser เท่านั้น</p>
        </div>
        <button className="secondary-button simulator-reset-button" type="button" onClick={() => setShowResetModal(true)}>
          <RotateCcw size={17} aria-hidden="true" />คืนข้อมูลจำลอง
        </button>
      </div>

      <div className="simulator-disclaimer">
        <ShieldCheck size={20} aria-hidden="true" />
        <div><strong>Frontend Prototype</strong><span>ไม่มีการเชื่อมต่อ Frizzlife Cloud, MQTT, WebSocket, SMS หรืออุปกรณ์จริง</span></div>
      </div>

      {feedback ? (
        <div className={`simulator-feedback${feedback.success ? '' : ' simulator-feedback--error'}`} role={feedback.success ? 'status' : 'alert'}>
          {feedback.message}<button type="button" onClick={() => setFeedback(null)}>ปิด</button>
        </div>
      ) : null}

      <div className="simulator-device-selector">
        <label>
          <span>เลือกอุปกรณ์สำหรับจำลอง</span>
          <select value={selectedDevice.id} onChange={(event) => {
            setSelectedDeviceId(event.target.value)
            setSelectedSensorId('')
          }}>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>{device.serialNumber} · {device.model} · {device.status}</option>
            ))}
          </select>
        </label>
        <span>Telemetry ทุก 4 วินาทีสำหรับทุกอุปกรณ์ที่ไม่ Offline · Controls ใช้กับเครื่องที่เลือก</span>
      </div>

      <SimulatorDevicePanel device={selectedDevice} latestTelemetry={latestTelemetry} />

      <div className="simulator-content-grid">
        <SimulationControls
          device={selectedDevice}
          sensors={selectedSensors}
          selectedSensorId={effectiveSensorId}
          onSensorChange={setSelectedSensorId}
          onSimulateLeak={handleSimulateLeak}
          onSimulateLeakResolved={handleSimulateLeakResolved}
          onSimulateOffline={handleSimulateOffline}
          onSimulateSpecificMetric={handleSpecificMetric}
        />
        <SimulationEventLog events={selectedEvents} />
      </div>

      <div className="simulator-cross-page-links">
        <div><strong>ตรวจผลข้ามหน้า</strong><span>ข้อมูลทั้งหมดใช้ Shared State ชุดเดียวกัน</span></div>
        <Link to="/admin/dashboard">Admin Overview</Link>
        <Link to={`/admin/devices/${selectedDevice.id}`}>Device Detail</Link>
        <Link to="/admin/alerts">Alerts</Link>
      </div>

      {showResetModal ? <ResetSimulationModal onClose={closeResetModal} onConfirm={handleReset} /> : null}
    </section>
  )
}
