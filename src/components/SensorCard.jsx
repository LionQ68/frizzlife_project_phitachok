import { BatteryMedium, Clock3, Droplets, MapPin, PencilLine, Radio } from 'lucide-react'
import { formatPercentage, formatRelativeTime } from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

function getSignalLabel(signalStrength) {
  if (signalStrength >= -60) {
    return 'สัญญาณดี'
  }

  if (signalStrength >= -75) {
    return 'สัญญาณปานกลาง'
  }

  return 'สัญญาณอ่อน'
}

export function SensorCard({ sensor, onEdit }) {
  const hasLowBattery = sensor.batteryLevel <= 20
  const isLeak = sensor.status === 'LEAK'

  return (
    <article className={`sensor-card${isLeak ? ' sensor-card--leak' : ''}`}>
      <div className="sensor-card__heading">
        <span className={`sensor-card__icon${isLeak ? ' sensor-card__icon--leak' : ''}`}>
          <Droplets size={19} aria-hidden="true" />
        </span>
        <div>
          <h4>{sensor.name}</h4>
          <span><MapPin size={13} aria-hidden="true" />{sensor.zone}</span>
        </div>
        <StatusBadge status={sensor.status} />
      </div>

      <div className="sensor-card__readings">
        <div className={hasLowBattery ? 'sensor-reading sensor-reading--warning' : 'sensor-reading'}>
          <BatteryMedium size={17} aria-hidden="true" />
          <span>Battery</span>
          <strong>{formatPercentage(sensor.batteryLevel)}</strong>
        </div>
        <div className="sensor-reading">
          <Radio size={17} aria-hidden="true" />
          <span>{getSignalLabel(sensor.signalStrength)}</span>
          <strong>{sensor.signalStrength} dBm</strong>
        </div>
      </div>

      <div className="sensor-card__last-seen">
        <Clock3 size={14} aria-hidden="true" />
        ติดต่อ {formatRelativeTime(sensor.lastSeenAt)}
      </div>

      {onEdit ? (
        <button className="sensor-card__edit" type="button" onClick={() => onEdit(sensor)}>
          <PencilLine size={14} aria-hidden="true" />
          แก้ชื่อ/ตำแหน่ง
        </button>
      ) : null}
    </article>
  )
}
