import {
  Bot,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  Radio,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ALERT_TYPE_LABELS } from '../utils/alertSelectors.js'
import { formatDateTime } from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

function getValveActionLabel(command) {
  if (!command) {
    return 'ไม่มีคำสั่งวาล์ว'
  }

  return `${command.command === 'CLOSE' ? 'ปิด' : 'เปิด'}วาล์วอัตโนมัติ · ${command.status}`
}

export function AlertIncidentCard({ item, selected, onAcknowledge, onResolve }) {
  const {
    alert,
    device,
    sensor,
    valveCommand,
    acknowledgedByUser,
    resolvedByUser,
  } = item

  return (
    <article className={`alert-card alert-card--${alert.severity.toLowerCase()}${selected ? ' alert-card--selected' : ''}`}>
      <div className="alert-card__heading">
        <div>
          <span className="alert-type-label"><Radio size={13} aria-hidden="true" />{ALERT_TYPE_LABELS[alert.type] ?? alert.type}</span>
          <h3>{alert.title}</h3>
        </div>
        <StatusBadge status={alert.severity} />
      </div>

      <p className="alert-card__message">{alert.message}</p>

      <div className="alert-card__meta">
        <span><Droplets size={15} aria-hidden="true" />{device ? <Link to={`/admin/devices/${device.id}`}>{device.serialNumber} · {device.model}</Link> : 'ไม่พบอุปกรณ์'}</span>
        <span><MapPin size={15} aria-hidden="true" />{device?.location ?? 'ไม่พบสถานที่'}</span>
        <span><Radio size={15} aria-hidden="true" />{sensor ? `${sensor.name} · ${sensor.zone}` : 'ไม่เกี่ยวข้องกับ Sensor'}</span>
        <span><Bot size={15} aria-hidden="true" />{getValveActionLabel(valveCommand)}</span>
        <span><Clock3 size={15} aria-hidden="true" />{formatDateTime(alert.createdAt)}</span>
      </div>

      {alert.status !== 'OPEN' ? (
        <div className="alert-card__audit">
          {alert.acknowledgedAt ? <span>รับทราบโดย {acknowledgedByUser?.name ?? alert.acknowledgedBy ?? 'ไม่ระบุ'} · {formatDateTime(alert.acknowledgedAt)}</span> : null}
          {alert.resolvedAt ? <span>Resolve โดย {resolvedByUser?.name ?? alert.resolvedBy ?? 'ไม่ระบุ'} · {formatDateTime(alert.resolvedAt)}</span> : null}
          {alert.resolutionNote ? <p><CheckCircle2 size={15} aria-hidden="true" />{alert.resolutionNote}</p> : null}
        </div>
      ) : null}

      <div className="alert-card__actions">
        <StatusBadge status={alert.status} />
        {alert.status === 'OPEN' ? (
          <button className="primary-button" type="button" onClick={() => onAcknowledge(alert.id)}>Acknowledge</button>
        ) : null}
        {alert.status === 'ACKNOWLEDGED' ? (
          <button className="primary-button" type="button" onClick={() => onResolve(item)}>Resolve</button>
        ) : null}
      </div>
    </article>
  )
}
