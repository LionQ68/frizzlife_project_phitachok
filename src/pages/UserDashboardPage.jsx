import {
  Activity,
  BellRing,
  Bot,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Droplets,
  History,
  House,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Thermometer,
  XCircle,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { DeviceHistoryChart } from '../components/DeviceHistoryChart.jsx'
import { PageState } from '../components/PageState.jsx'
import { SensorCard } from '../components/SensorCard.jsx'
import { SensorEditModal } from '../components/SensorEditModal.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { UserWaterUsageChart } from '../components/UserWaterUsageChart.jsx'
import { ValveControlPanel } from '../components/ValveControlPanel.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { ALERT_TYPE_LABELS } from '../utils/alertSelectors.js'
import {
  formatDateTime,
  formatFlowRate,
  formatPressure,
  formatRelativeTime,
  formatTemperature,
  formatWaterUsage,
} from '../utils/formatters.js'
import { getUserDashboardData } from '../utils/userDashboardSelectors.js'

function UserMetric({ icon: Icon, label, value, helper, tone = 'primary' }) {
  return (
    <article className={`user-metric user-metric--${tone}`}>
      <span className="user-metric__icon"><Icon size={21} aria-hidden="true" /></span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  )
}

function getRequesterName(users, requestedBy) {
  if (requestedBy === 'SYSTEM') {
    return 'ระบบอัตโนมัติ'
  }

  return users.find(({ id }) => id === requestedBy)?.name ?? 'ผู้ใช้งาน'
}

export function UserDashboardPage() {
  const context = useAppContext()
  const {
    alerts,
    currentUser,
    leakSensors,
    telemetry,
    updateSensor,
    users,
    valveCommands,
    visibleDevices,
    requestValveCommand,
  } = context
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    () => visibleDevices[0]?.id ?? '',
  )
  const [editingSensor, setEditingSensor] = useState(null)

  const dashboardData = useMemo(() => getUserDashboardData(
    { alerts, leakSensors, telemetry, valveCommands },
    visibleDevices,
    selectedDeviceId,
  ), [alerts, leakSensors, selectedDeviceId, telemetry, valveCommands, visibleDevices])
  const closeSensorModal = useCallback(() => setEditingSensor(null), [])

  if (!dashboardData.device) {
    return (
      <section className="user-dashboard-page">
        <PageState
          type="empty"
          title="ยังไม่มีอุปกรณ์ในบัญชีนี้"
          description="กรุณาติดต่อผู้ดูแลระบบเพื่อผูกอุปกรณ์จำลองกับบัญชีของคุณ"
        />
      </section>
    )
  }

  const {
    alerts: deviceAlerts,
    device,
    hasActiveCriticalAlert,
    hasActiveLeak,
    latestTelemetry,
    personalAlertCount,
    sensors,
    usageSeries,
    valveHistory,
  } = dashboardData
  const isTemperatureModel = device.capabilities.temperature
  const safetyCritical = hasActiveLeak || hasActiveCriticalAlert
  const valveState = {
    devices: visibleDevices,
    leakSensors: sensors,
    alerts: alerts.filter((alert) => alert.deviceId === device.id),
  }

  const handleSensorSave = (changes) => updateSensor(editingSensor.id, changes)

  return (
    <section className="user-dashboard-page">
      <header className="user-dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">
            <House size={15} aria-hidden="true" /> ระบบน้ำของฉัน
            <span className="dashboard-demo-label">ข้อมูลจำลอง</span>
          </span>
          <h2>สวัสดี {currentUser.name}</h2>
          <p>ติดตามการใช้น้ำ ตรวจสอบความปลอดภัย และควบคุมวาล์วของอุปกรณ์ที่ผูกกับบัญชีนี้</p>
        </div>

        <label className="device-selector">
          <span>เลือกอุปกรณ์ของฉัน</span>
          <select value={device.id} onChange={(event) => setSelectedDeviceId(event.target.value)}>
            {visibleDevices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.serialNumber} · {item.model}
              </option>
            ))}
          </select>
        </label>
      </header>

      <article className={`user-safety-banner${safetyCritical ? ' user-safety-banner--critical' : ''}`}>
        <span className="user-safety-banner__icon">
          {safetyCritical ? <ShieldAlert size={25} aria-hidden="true" /> : <ShieldCheck size={25} aria-hidden="true" />}
        </span>
        <div>
          <span>SAFETY STATUS</span>
          <strong>{safetyCritical ? 'ต้องตรวจสอบความปลอดภัย' : 'ระบบน้ำอยู่ในสถานะปกติ'}</strong>
          <p>
            {hasActiveLeak
              ? 'Leak Sensor กำลังตรวจพบน้ำ ระบบจะไม่อนุญาตให้เปิดวาล์ว'
              : hasActiveCriticalAlert
                ? 'มี Critical Alert ที่ยังไม่ Resolved ระบบจะไม่อนุญาตให้เปิดวาล์ว'
                : `Sensor ${sensors.length} จุดไม่พบ Leak ที่กำลัง Active`}
          </p>
        </div>
        <div className="user-safety-banner__badges">
          <StatusBadge status={device.status} />
          <StatusBadge status={device.valveStatus} />
        </div>
      </article>

      <article className="user-device-strip">
        <div>
          <span className="devices-eyebrow">SELECTED DEVICE</span>
          <div className="user-device-strip__title">
            <h3>{device.name}</h3>
            <span className={`model-badge model-badge--${isTemperatureModel ? 'temperature' : 'pressure'}`}>{device.model}</span>
          </div>
          <p><MapPin size={14} aria-hidden="true" />{device.location} · {device.serialNumber}</p>
        </div>
        <div className="user-protection-readonly">
          <ShieldCheck size={18} aria-hidden="true" />
          <div>
            <span>Protection</span>
            <strong>{device.protectionEnabled ? 'Enabled' : 'Disabled'}</strong>
            <small>แสดงสถานะเท่านั้นใน MVP</small>
          </div>
        </div>
      </article>

      <div className="user-metrics-grid">
        <UserMetric
          icon={Activity}
          label="Flow Rate"
          value={latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ยังไม่มีข้อมูล'}
          helper={latestTelemetry ? `อัปเดต ${formatRelativeTime(latestTelemetry.recordedAt)}` : 'ยังไม่มี Telemetry'}
        />
        <UserMetric
          icon={Droplets}
          label="Water Usage"
          value={latestTelemetry ? formatWaterUsage(latestTelemetry.usageTotal) : 'ยังไม่มีข้อมูล'}
          helper="ปริมาณสะสมจำลอง"
          tone="info"
        />
        <UserMetric
          icon={isTemperatureModel ? Thermometer : CircleGauge}
          label={isTemperatureModel ? 'Water Temperature' : 'Water Pressure'}
          value={latestTelemetry
            ? isTemperatureModel
              ? formatTemperature(latestTelemetry.temperature)
              : formatPressure(latestTelemetry.pressure)
            : 'ยังไม่มีข้อมูล'}
          helper={`Metric เฉพาะรุ่น ${device.model}`}
          tone={isTemperatureModel ? 'warning' : 'violet'}
        />
        <UserMetric
          icon={BellRing}
          label="Personal Alerts"
          value={`${personalAlertCount} Active`}
          helper="รวมทุกอุปกรณ์ในบัญชีนี้"
          tone={personalAlertCount > 0 ? 'critical' : 'success'}
        />
      </div>

      <div className="user-control-grid">
        <article className="user-device-summary">
          <div className="device-detail-panel__heading">
            <div><span className="devices-eyebrow">DEVICE INFORMATION</span><h3>ข้อมูลอุปกรณ์ของฉัน</h3></div>
            <StatusBadge status={device.status} />
          </div>
          <dl>
            <div><dt>Model</dt><dd>{device.model}</dd></div>
            <div><dt>Package</dt><dd>{device.packageVariant}</dd></div>
            <div><dt>Firmware</dt><dd>{device.firmwareVersion}</dd></div>
            <div><dt>ติดต่อครั้งล่าสุด</dt><dd>{formatDateTime(device.lastSeenAt)}</dd></div>
          </dl>
          <p className="user-demo-note">Frontend Prototype · ไม่มีการเชื่อมต่อ Frizzlife Cloud หรืออุปกรณ์จริง</p>
        </article>

        <ValveControlPanel
          key={`user-valve-${device.id}`}
          appState={valveState}
          device={device}
          onRequestCommand={requestValveCommand}
        />
      </div>

      <section className="device-sensors-section" aria-labelledby="user-sensors-title">
        <div className="device-section-heading">
          <div>
            <span className="devices-eyebrow">MY LEAK SENSORS</span>
            <h3 id="user-sensors-title">Leak Sensors</h3>
            <p>ตรวจสอบ Sensor {sensors.length} จุด และแก้ไขชื่อหรือตำแหน่งได้</p>
          </div>
          <span className={`device-section-heading__status${safetyCritical ? ' user-protection-status--critical' : ''}`}>
            {safetyCritical ? <ShieldAlert size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
            {safetyCritical ? 'ตรวจพบเหตุที่ต้องตรวจสอบ' : 'ระบบป้องกันพร้อมทำงาน'}
          </span>
        </div>
        {sensors.length > 0 ? (
          <div className="sensor-card-grid">
            {sensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} onEdit={setEditingSensor} />
            ))}
          </div>
        ) : <div className="device-detail-empty">ยังไม่มี Sensor สำหรับอุปกรณ์นี้</div>}
      </section>

      <DeviceHistoryChart key={`user-history-${device.id}`} device={device} telemetry={telemetry} />
      <UserWaterUsageChart series={usageSeries} />

      <div className="device-history-grid">
        <section className="device-history-panel" aria-labelledby="user-valve-history-title">
          <div className="device-detail-panel__heading">
            <div><span className="devices-eyebrow">RECENT ACTIVITY</span><h3 id="user-valve-history-title">ประวัติคำสั่งวาล์ว</h3></div>
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
                    <span><Bot size={13} aria-hidden="true" />{getRequesterName(users, command.requestedBy)} · {formatDateTime(command.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="device-detail-empty">ยังไม่มีประวัติคำสั่งวาล์ว</div>}
        </section>

        <section className="device-history-panel" aria-labelledby="user-alerts-title">
          <div className="device-detail-panel__heading">
            <div><span className="devices-eyebrow">PERSONAL ALERTS</span><h3 id="user-alerts-title">Alerts ของอุปกรณ์นี้</h3></div>
            <BellRing size={20} aria-hidden="true" />
          </div>
          {deviceAlerts.length > 0 ? (
            <div className="user-alert-list">
              {deviceAlerts.map((alert) => (
                <article className={`user-alert-item user-alert-item--${alert.severity.toLowerCase()}`} key={alert.id}>
                  <span className="user-alert-item__icon"><BellRing size={17} aria-hidden="true" /></span>
                  <div>
                    <div><strong>{alert.title}</strong><StatusBadge status={alert.status} /></div>
                    <p>{alert.message}</p>
                    <span><Clock3 size={13} aria-hidden="true" />{ALERT_TYPE_LABELS[alert.type] ?? alert.type} · {formatDateTime(alert.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="device-detail-empty">อุปกรณ์นี้ยังไม่มี Alert</div>}
        </section>
      </div>

      {editingSensor ? (
        <SensorEditModal
          key={editingSensor.id}
          sensor={editingSensor}
          onClose={closeSensorModal}
          onSave={handleSensorSave}
        />
      ) : null}
    </section>
  )
}
