import {
  AlertTriangle,
  CircleCheckBig,
  CircleGauge,
  CloudOff,
  History,
  Thermometer,
} from 'lucide-react'
import { formatDateTime } from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

const EVENT_CONFIG = Object.freeze({
  LEAK_SIMULATED: { label: 'Leak Simulation', icon: AlertTriangle },
  LEAK_CLEARED_SIMULATED: { label: 'Customer Fixed Leak', icon: CircleCheckBig },
  DEVICE_OFFLINE_SIMULATED: { label: 'Device Offline', icon: CloudOff },
  TEMPERATURE_SIMULATED: { label: 'Temperature', icon: Thermometer },
  PRESSURE_SIMULATED: { label: 'Pressure', icon: CircleGauge },
})

export function SimulationEventLog({ events }) {
  return (
    <section className="simulation-event-panel" aria-labelledby="simulation-event-title">
      <div className="simulation-section-heading">
        <div><span className="devices-eyebrow">EVENT LOG</span><h3 id="simulation-event-title">ประวัติการจำลอง</h3></div>
        <span>ล่าสุด {events.length} รายการ · Asia/Bangkok</span>
      </div>

      {events.length > 0 ? (
        <div className="simulation-event-list">
          {events.map((event) => {
            const config = EVENT_CONFIG[event.type] ?? { label: event.type, icon: History }
            const EventIcon = config.icon

            return (
              <article className={`simulation-event simulation-event--${event.severity.toLowerCase()}`} key={event.id}>
                <span className="simulation-event__icon"><EventIcon size={18} aria-hidden="true" /></span>
                <div><div><strong>{config.label}</strong><StatusBadge status={event.severity} /></div><p>{event.message}</p><span>{formatDateTime(event.createdAt)}</span></div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="simulation-event-empty">
          <History size={27} aria-hidden="true" />
          <h4>ยังไม่มีเหตุการณ์ของอุปกรณ์นี้</h4>
          <p>เลือกปุ่มจำลองเหตุการณ์เพื่อสร้าง Event Log</p>
        </div>
      )}
    </section>
  )
}
