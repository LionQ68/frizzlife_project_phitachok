import {
  Activity,
  ArrowLeft,
  BellRing,
  Bot,
  CheckCircle2,
  CircleGauge,
  Droplets,
  History,
  MapPin,
  ShieldCheck,
  Thermometer,
  UserRound,
  XCircle,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DeviceHistoryChart } from '../components/DeviceHistoryChart.jsx'
import { SensorCard } from '../components/SensorCard.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { ValveControlPanel } from '../components/ValveControlPanel.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { getLatestTelemetry } from '../utils/dashboardSelectors.js'
import {
  getDeviceAlerts,
  getDeviceSensors,
  getDeviceValveHistory,
} from '../utils/deviceDetailSelectors.js'
import {
  formatDateTime,
  formatFlowRate,
  formatPressure,
  formatRelativeTime,
  formatTemperature,
  formatWaterUsage,
} from '../utils/formatters.js'

const ALERT_TYPE_LABELS = Object.freeze({
  MICRO_LEAK: 'Micro Leak',
  SENSOR_LEAK: 'Sensor Leak',
  ABNORMAL_FLOW: 'Abnormal Flow',
  TEMPERATURE: 'Temperature',
  PRESSURE: 'Pressure',
  OFFLINE: 'Offline',
  LOW_BATTERY: 'Low Battery',
})

function DetailMetric({ icon: Icon, label, value, helper }) {
  return (
    <article className="device-detail-metric">
      <span className="device-detail-metric__icon"><Icon size={20} aria-hidden="true" /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>
    </article>
  )
}

function getRequesterName(users, requestedBy) {
  if (requestedBy === 'SYSTEM') {
    return 'ระบบอัตโนมัติ'
  }

  return users.find(({ id }) => id === requestedBy)?.name ?? requestedBy
}

function getRequesterType(users, command) {
  if (command.source === 'AUTOMATION') {
    return 'Automation'
  }

  return users.find(({ id }) => id === command.requestedBy)?.role === 'ADMIN'
    ? 'Admin'
    : 'User'
}

export function DeviceDetailPage() {
  const { deviceId } = useParams()
  const context = useAppContext()
  const {
    devices,
    telemetry,
    users,
    leakSensors,
    alerts,
    valveCommands,
    requestValveCommand,
  } = context
  const device = devices.find(({ id }) => id === deviceId)

  if (!device) {
    return (
      <section className="device-detail-page">
        <Link className="device-detail-back" to="/admin/devices"><ArrowLeft size={17} aria-hidden="true" />กลับไปรายการอุปกรณ์</Link>
        <div className="devices-empty-state device-detail-not-found">
          <CircleGauge size={30} aria-hidden="true" />
          <h2>ไม่พบอุปกรณ์</h2>
          <p>Device ID นี้ไม่มีอยู่ในข้อมูลจำลอง หรืออุปกรณ์อาจถูกเปลี่ยนแปลงไปแล้ว</p>
          <Link className="secondary-link" to="/admin/devices">ดูอุปกรณ์ทั้งหมด</Link>
        </div>
      </section>
    )
  }

  const latestTelemetry = getLatestTelemetry(telemetry, device.id)
  const assignedUser = users.find(({ id }) => id === device.assignedUserId)
  const sensors = getDeviceSensors(leakSensors, device.id)
  const deviceAlerts = getDeviceAlerts(alerts, device.id)
  const valveHistory = getDeviceValveHistory(valveCommands, device.id)
  const sensorById = new Map(sensors.map((sensor) => [sensor.id, sensor]))
  const isTemperatureModel = device.capabilities.temperature
  const specificValue = latestTelemetry
    ? isTemperatureModel
      ? formatTemperature(latestTelemetry.temperature)
      : formatPressure(latestTelemetry.pressure)
    : 'ยังไม่มีข้อมูล'
  const valveState = { devices, leakSensors, alerts }

  return (
    <section className="device-detail-page">
      <Link className="device-detail-back" to="/admin/devices"><ArrowLeft size={17} aria-hidden="true" />กลับไปรายการอุปกรณ์</Link>

      <div className="device-detail-hero">
        <div>
          <span className="devices-eyebrow">DEVICE DETAIL · DEMO DATA</span>
          <div className="device-detail-hero__title">
            <h2>{device.serialNumber}</h2>
            <span className={`model-badge model-badge--${isTemperatureModel ? 'temperature' : 'pressure'}`}>{device.model}</span>
          </div>
          <p>{device.name} · {device.location}</p>
        </div>
        <div className="device-detail-hero__statuses">
          <StatusBadge status={device.status} />
          <StatusBadge status={device.valveStatus} />
          <StatusBadge status={device.protectionEnabled ? 'ONLINE' : 'OFFLINE'} label={device.protectionEnabled ? 'Protection Enabled' : 'Protection Disabled'} />
        </div>
      </div>

      <div className="device-detail-metrics">
        <DetailMetric icon={Activity} label="Flow Rate" value={latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ยังไม่มีข้อมูล'} helper={latestTelemetry ? `บันทึก ${formatRelativeTime(latestTelemetry.recordedAt)}` : 'ยังไม่มี Telemetry'} />
        <DetailMetric icon={Droplets} label="Water Usage" value={latestTelemetry ? formatWaterUsage(latestTelemetry.usageTotal) : 'ยังไม่มีข้อมูล'} helper="ปริมาณสะสม" />
        <DetailMetric icon={isTemperatureModel ? Thermometer : CircleGauge} label={isTemperatureModel ? 'Water Temperature' : 'Water Pressure'} value={specificValue} helper={`รองรับโดย ${device.model}`} />
      </div>

      <div className="device-detail-grid device-detail-grid--overview">
        <article className="device-detail-panel">
          <div className="device-detail-panel__heading"><h3>ข้อมูลอุปกรณ์</h3><span>ข้อมูลจำลอง</span></div>
          <dl className="device-detail-list">
            <div><dt><MapPin size={16} aria-hidden="true" />สถานที่ติดตั้ง</dt><dd>{device.location}</dd></div>
            <div><dt><UserRound size={16} aria-hidden="true" />Assigned User</dt><dd>{assignedUser?.name ?? 'ยังไม่ผูก User'}</dd></div>
            <div><dt>ลูกค้า</dt><dd>{device.customerName || 'ไม่ได้ระบุ'}</dd></div>
            <div><dt>Firmware</dt><dd>{device.firmwareVersion}</dd></div>
            <div><dt>Package</dt><dd>{device.packageVariant}</dd></div>
            <div><dt>ติดต่อครั้งล่าสุด</dt><dd>{formatDateTime(device.lastSeenAt)}</dd></div>
          </dl>
        </article>

        <ValveControlPanel
          key={`valve-${device.id}`}
          appState={valveState}
          device={device}
          onRequestCommand={requestValveCommand}
        />
      </div>

      <section className="device-sensors-section" aria-labelledby="device-sensors-title">
        <div className="device-section-heading">
          <div>
            <span className="devices-eyebrow">LEAK SENSOR MONITORING</span>
            <h3 id="device-sensors-title">Leak Sensors</h3>
            <p>Package {device.packageVariant} · Sensor จำลอง {sensors.length} จุด</p>
          </div>
          <span className="device-section-heading__status"><ShieldCheck size={17} aria-hidden="true" />ระบบป้องกัน {device.protectionEnabled ? 'เปิดอยู่' : 'ปิดอยู่'}</span>
        </div>
        {sensors.length > 0 ? (
          <div className="sensor-card-grid">
            {sensors.map((sensor) => <SensorCard key={sensor.id} sensor={sensor} />)}
          </div>
        ) : (
          <div className="device-detail-empty">ยังไม่มี Sensor สำหรับอุปกรณ์นี้</div>
        )}
      </section>

      <DeviceHistoryChart
        key={`history-${device.id}`}
        device={device}
        telemetry={telemetry}
      />

      <div className="device-history-grid">
        <section className="device-history-panel" aria-labelledby="valve-history-title">
          <div className="device-detail-panel__heading">
            <div><span className="devices-eyebrow">AUDIT LOG</span><h3 id="valve-history-title">ประวัติคำสั่งวาล์ว</h3></div>
            <History size={20} aria-hidden="true" />
          </div>
          {valveHistory.length > 0 ? (
            <div className="device-timeline">
              {valveHistory.map((command) => (
                <article className="device-timeline-item" key={command.id}>
                  <span className={`device-timeline-item__icon${command.status === 'FAILED' ? ' device-timeline-item__icon--error' : ''}`}>
                    {command.status === 'FAILED' ? <XCircle size={17} aria-hidden="true" /> : <CheckCircle2 size={17} aria-hidden="true" />}
                  </span>
                  <div className="device-timeline-item__copy">
                    <div><strong>{command.command === 'OPEN' ? 'เปิดวาล์ว' : 'ปิดวาล์ว'}</strong><StatusBadge status={command.status} /></div>
                    <p>{command.reason}</p>
                    <span><Bot size={13} aria-hidden="true" />{getRequesterName(users, command.requestedBy)} · {getRequesterType(users, command)} · {formatDateTime(command.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="device-detail-empty">ยังไม่มีประวัติคำสั่งวาล์ว</div>}
        </section>

        <section className="device-history-panel" aria-labelledby="alert-history-title">
          <div className="device-detail-panel__heading">
            <div><span className="devices-eyebrow">INCIDENT HISTORY</span><h3 id="alert-history-title">ประวัติ Alerts</h3></div>
            <Link className="dashboard-text-link" to="/admin/alerts">ดูทั้งหมด</Link>
          </div>
          {deviceAlerts.length > 0 ? (
            <div className="device-alert-list">
              {deviceAlerts.map((alert) => (
                <Link className="device-alert-item" key={alert.id} to={`/admin/alerts?alert=${alert.id}`}>
                  <span className={`device-alert-item__icon device-alert-item__icon--${alert.severity.toLowerCase()}`}><BellRing size={17} aria-hidden="true" /></span>
                  <div>
                    <div><strong>{alert.title}</strong><StatusBadge status={alert.status} /></div>
                    <p>{alert.message}</p>
                    <span>{ALERT_TYPE_LABELS[alert.type] ?? alert.type}{alert.sensorId ? ` · ${sensorById.get(alert.sensorId)?.name ?? 'Sensor'}` : ''} · {formatDateTime(alert.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : <div className="device-detail-empty">ยังไม่มี Alert ของอุปกรณ์นี้</div>}
        </section>
      </div>
    </section>
  )
}
