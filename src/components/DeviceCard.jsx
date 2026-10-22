import { Activity, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  formatFlowRate,
  formatPressure,
  formatRelativeTime,
  formatTemperature,
  formatWaterUsage,
} from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

function getSpecificMetric(device, latestTelemetry) {
  if (!latestTelemetry) {
    return 'ยังไม่มีข้อมูล'
  }

  return device.capabilities.temperature
    ? formatTemperature(latestTelemetry.temperature)
    : formatPressure(latestTelemetry.pressure)
}

export function DeviceCard({ item, onEdit }) {
  const { device, latestTelemetry, assignedUser } = item

  return (
    <article className="device-card">
      <div className="device-card__heading">
        <div>
          <span className={`model-badge model-badge--${device.model === 'LPG365' ? 'temperature' : 'pressure'}`}>
            {device.model}
          </span>
          <h3>{device.serialNumber}</h3>
          <p>{device.name}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>

      <div className="device-card__meta">
        <span><MapPin size={15} aria-hidden="true" />{device.location}</span>
        <span><UserRound size={15} aria-hidden="true" />{assignedUser?.name ?? 'ยังไม่ผูก User'}</span>
        <span><Activity size={15} aria-hidden="true" />ติดต่อ {formatRelativeTime(device.lastSeenAt)}</span>
      </div>

      <div className="device-card__metrics">
        <div>
          <span>Flow</span>
          <strong>{latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ยังไม่มีข้อมูล'}</strong>
        </div>
        <div>
          <span>{device.capabilities.temperature ? 'Temperature' : 'Pressure'}</span>
          <strong>{getSpecificMetric(device, latestTelemetry)}</strong>
        </div>
        <div>
          <span>Usage</span>
          <strong>{latestTelemetry ? formatWaterUsage(latestTelemetry.usageTotal) : 'ยังไม่มีข้อมูล'}</strong>
        </div>
      </div>

      <div className="device-card__status-row">
        <span>Valve <StatusBadge status={device.valveStatus} /></span>
        <span>Protection <StatusBadge status={device.protectionEnabled ? 'ONLINE' : 'OFFLINE'} label={device.protectionEnabled ? 'Enabled' : 'Disabled'} /></span>
      </div>

      <div className="device-card__actions">
        <Link className="secondary-link" to={`/admin/devices/${device.id}`}>ดูรายละเอียด</Link>
        <button className="text-button" type="button" onClick={() => onEdit(device)}>แก้ไข</button>
      </div>
    </article>
  )
}
