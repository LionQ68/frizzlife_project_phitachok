import {
  AlertTriangle,
  CircleCheckBig,
  CircleGauge,
  CloudOff,
  Droplets,
  Thermometer,
} from 'lucide-react'

export function SimulationControls({
  device,
  sensors,
  selectedSensorId,
  onSensorChange,
  onSimulateLeak,
  onSimulateLeakResolved,
  onSimulateOffline,
  onSimulateSpecificMetric,
}) {
  const selectedSensor = sensors.find(({ id }) => id === selectedSensorId)
  const isOffline = device.status === 'OFFLINE'
  const hasActiveLeak = selectedSensor?.status === 'LEAK'
  const SpecificIcon = device.capabilities.temperature ? Thermometer : CircleGauge
  const specificTitle = device.capabilities.temperature
    ? 'Abnormal Temperature'
    : 'High Pressure'
  const specificDescription = device.capabilities.temperature
    ? 'ปรับค่าเป็น 52 °C และสร้าง Warning Alert'
    : 'ปรับค่าเป็น 88 PSI และสร้าง Warning Alert'

  return (
    <section className="simulation-controls" aria-labelledby="simulation-controls-title">
      <div className="simulation-section-heading">
        <div><span className="devices-eyebrow">EVENT CONTROLS</span><h3 id="simulation-controls-title">จำลองเหตุการณ์</h3></div>
        <span>ปุ่มเปลี่ยนตาม Capability ของรุ่น</span>
      </div>

      <div className="simulation-sensor-picker">
        <label>
          <span>Leak Sensor</span>
          <select value={selectedSensorId} onChange={(event) => onSensorChange(event.target.value)}>
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>{sensor.name} · {sensor.zone} · {sensor.status}</option>
            ))}
          </select>
        </label>
        <div className={`simulation-sensor-status simulation-sensor-status--${selectedSensor?.status.toLowerCase() ?? 'offline'}`}>
          <Droplets size={18} aria-hidden="true" />
          <div><strong>{selectedSensor?.status ?? 'ไม่พบ Sensor'}</strong><span>{selectedSensor?.zone ?? 'เลือก Sensor เพื่อจำลอง'}</span></div>
        </div>
      </div>

      <div className="simulation-action-grid">
        <article className="simulation-action-card simulation-action-card--critical">
          <span className="simulation-action-card__icon"><AlertTriangle size={22} aria-hidden="true" /></span>
          <div><h4>Simulate Leak</h4><p>Sensor → Leak, สร้าง Critical Alert และปิดวาล์ว</p></div>
          <button className="primary-button primary-button--danger" type="button" disabled={isOffline || hasActiveLeak} onClick={onSimulateLeak}>
            {hasActiveLeak ? 'Leak กำลัง Active' : 'จำลองน้ำรั่ว'}
          </button>
          {isOffline ? <small>ใช้งานไม่ได้ขณะอุปกรณ์ Offline</small> : null}
        </article>

        <article className="simulation-action-card simulation-action-card--resolved">
          <span className="simulation-action-card__icon"><CircleCheckBig size={22} aria-hidden="true" /></span>
          <div><h4>Resolve Leak Simulation</h4><p>ลูกค้าแก้ไขแล้ว: Sensor → Normal, ปิด Alert และคงวาล์วปิด</p></div>
          <button className="primary-button" type="button" disabled={isOffline || !hasActiveLeak} onClick={onSimulateLeakResolved}>
            {hasActiveLeak ? 'จำลองลูกค้าแก้ไขแล้ว' : 'ยังไม่มี Leak Active'}
          </button>
          {isOffline ? <small>ใช้งานไม่ได้ขณะอุปกรณ์ Offline</small> : null}
        </article>

        <article className="simulation-action-card">
          <span className="simulation-action-card__icon"><SpecificIcon size={22} aria-hidden="true" /></span>
          <div><h4>{specificTitle}</h4><p>{specificDescription}</p></div>
          <button className="primary-button" type="button" disabled={isOffline} onClick={onSimulateSpecificMetric}>
            จำลอง {device.capabilities.temperature ? 'Temperature' : 'Pressure'}
          </button>
          {isOffline ? <small>ใช้งานไม่ได้ขณะอุปกรณ์ Offline</small> : null}
        </article>

        <article className="simulation-action-card simulation-action-card--offline">
          <span className="simulation-action-card__icon"><CloudOff size={22} aria-hidden="true" /></span>
          <div><h4>Simulate Offline</h4><p>หยุด Telemetry และปิดการควบคุมวาล์วของเครื่องนี้</p></div>
          <button className="secondary-button" type="button" disabled={isOffline} onClick={onSimulateOffline}>
            {isOffline ? 'อุปกรณ์ Offline อยู่แล้ว' : 'จำลอง Offline'}
          </button>
        </article>
      </div>
    </section>
  )
}
