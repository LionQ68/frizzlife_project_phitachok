import {
  Activity,
  CircleGauge,
  Clock3,
  Droplets,
  MapPin,
  Thermometer,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  formatDateTime,
  formatFlowRate,
  formatPressure,
  formatTemperature,
  formatWaterUsage,
} from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

export function SimulatorDevicePanel({ device, latestTelemetry }) {
  const MetricIcon = device.capabilities.temperature ? Thermometer : CircleGauge
  const specificLabel = device.capabilities.temperature ? 'Temperature' : 'Pressure'
  const specificValue = latestTelemetry
    ? device.capabilities.temperature
      ? formatTemperature(latestTelemetry.temperature)
      : formatPressure(latestTelemetry.pressure)
    : 'ยังไม่มีข้อมูล'
  const isRunning = device.status !== 'OFFLINE'

  return (
    <section className="simulator-device-panel" aria-labelledby="simulator-live-title">
      <div className="simulator-device-panel__heading">
        <div>
          <span className="devices-eyebrow">SELECTED DEVICE</span>
          <div className="simulator-device-panel__title">
            <h3 id="simulator-live-title">{device.serialNumber}</h3>
            <span className={`model-badge model-badge--${device.capabilities.temperature ? 'temperature' : 'pressure'}`}>{device.model}</span>
          </div>
          <p><MapPin size={14} aria-hidden="true" />{device.location}</p>
        </div>
        <div className="simulator-device-panel__statuses">
          <StatusBadge status={device.status} />
          <StatusBadge status={device.valveStatus} label={`Valve ${device.valveStatus}`} />
        </div>
      </div>

      <div className={`simulator-runtime-status${isRunning ? '' : ' simulator-runtime-status--paused'}`} role="status">
        <span className="simulator-runtime-status__pulse" aria-hidden="true" />
        <div>
          <strong>{isRunning ? 'Telemetry กำลังทำงาน' : 'Telemetry หยุดชั่วคราว'}</strong>
          <span>{isRunning ? 'อัปเดตข้อมูลจำลองทุก 4 วินาทีขณะเปิดหน้านี้' : 'อุปกรณ์ Offline จึงไม่มีการสร้างข้อมูลใหม่'}</span>
        </div>
      </div>

      <div className="simulator-live-metrics">
        <article>
          <span className="simulator-live-metrics__icon"><Activity size={19} aria-hidden="true" /></span>
          <div><span>Flow Rate</span><strong>{latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ยังไม่มีข้อมูล'}</strong><small>อัปเดตอัตโนมัติ</small></div>
        </article>
        <article>
          <span className="simulator-live-metrics__icon"><Droplets size={19} aria-hidden="true" /></span>
          <div><span>Water Usage</span><strong>{latestTelemetry ? formatWaterUsage(latestTelemetry.usageTotal) : 'ยังไม่มีข้อมูล'}</strong><small>ค่าสะสมจำลอง</small></div>
        </article>
        <article>
          <span className="simulator-live-metrics__icon"><MetricIcon size={19} aria-hidden="true" /></span>
          <div><span>{specificLabel}</span><strong>{specificValue}</strong><small>{device.model} capability</small></div>
        </article>
      </div>

      <div className="simulator-device-panel__footer">
        <span><Clock3 size={14} aria-hidden="true" />ข้อมูลล่าสุด {latestTelemetry ? formatDateTime(latestTelemetry.recordedAt) : 'ยังไม่มีข้อมูล'}</span>
        <Link to={`/admin/devices/${device.id}`}>เปิด Device Detail</Link>
      </div>
    </section>
  )
}
