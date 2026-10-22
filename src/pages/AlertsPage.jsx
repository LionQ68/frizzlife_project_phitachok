import {
  AlertOctagon,
  BellRing,
  Bot,
  CheckCircle2,
  Clock3,
  FilterX,
  MapPin,
  Radio,
  ShieldAlert,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertIncidentCard } from '../components/AlertIncidentCard.jsx'
import { ResolveAlertModal } from '../components/ResolveAlertModal.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { useAppContext } from '../context/useAppContext.js'
import {
  ALERT_SEVERITIES,
  ALERT_STATUSES,
  ALERT_TYPE_LABELS,
  createAlertListItems,
  DEFAULT_ALERT_FILTERS,
  filterAlertItems,
  getAlertSummary,
  hasActiveAlertFilters,
} from '../utils/alertSelectors.js'
import { formatDateTime } from '../utils/formatters.js'

function getValveActionLabel(command) {
  if (!command) {
    return 'ไม่มีคำสั่งวาล์ว'
  }

  return `${command.command === 'CLOSE' ? 'Close' : 'Open'} · Automation · ${command.status}`
}

export function AlertsPage() {
  const {
    alerts,
    devices,
    leakSensors,
    valveCommands,
    users,
    acknowledgeAlert,
    resolveAlert,
  } = useAppContext()
  const [searchParams] = useSearchParams()
  const selectedAlertId = searchParams.get('alert')
  const [filters, setFilters] = useState(DEFAULT_ALERT_FILTERS)
  const [resolveItem, setResolveItem] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const closeResolveModal = useCallback(() => setResolveItem(null), [])
  const allItems = useMemo(
    () => createAlertListItems({ alerts, devices, leakSensors, valveCommands, users }),
    [alerts, devices, leakSensors, users, valveCommands],
  )
  const filteredItems = useMemo(
    () => filterAlertItems(allItems, filters),
    [allItems, filters],
  )
  const summary = useMemo(() => getAlertSummary(alerts), [alerts])
  const hasFilters = hasActiveAlertFilters(filters)

  useEffect(() => {
    if (!selectedAlertId) {
      return
    }

    const selectedNode = Array.from(
      document.querySelectorAll('[data-alert-id]'),
    ).find((node) => (
      node.dataset.alertId === selectedAlertId
      && node.getClientRects().length > 0
    ))

    selectedNode?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [filteredItems, selectedAlertId])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleAcknowledge = (alertId) => {
    const result = acknowledgeAlert(alertId)
    setFeedback({ success: result.success, message: result.message })
  }

  const handleResolve = (alertId, resolutionNote) => {
    const result = resolveAlert(alertId, resolutionNote)
    setFeedback({ success: result.success, message: result.message })
    return result
  }

  return (
    <section className="alerts-page">
      <div className="alerts-heading">
        <div>
          <span className="devices-eyebrow">INCIDENT MANAGEMENT · DEMO DATA</span>
          <h2>Alerts &amp; Incidents</h2>
          <p>ตรวจสอบ รับทราบ และปิดเหตุการณ์จำลองจากอุปกรณ์และ Leak Sensors</p>
        </div>
        <div className="alerts-heading__note">
          <span className="alerts-heading__note-icon" aria-hidden="true">
            <ShieldAlert size={19} />
          </span>
          <div><strong>Safety rule</strong><span>Resolve แล้ววาล์วจะไม่เปิดอัตโนมัติ</span></div>
        </div>
      </div>

      {feedback ? (
        <div className={`alerts-feedback${feedback.success ? '' : ' alerts-feedback--error'}`} role={feedback.success ? 'status' : 'alert'}>
          {feedback.message}
          <button type="button" onClick={() => setFeedback(null)}>ปิด</button>
        </div>
      ) : null}

      <div className="alert-summary-grid" aria-label="สรุป Alerts">
        <article className="alert-summary-card alert-summary-card--active">
          <span className="alert-summary-card__icon"><BellRing size={20} aria-hidden="true" /></span>
          <div><span>Active Incidents</span><strong>{summary.active}</strong><small>Open และ Acknowledged</small></div>
        </article>
        <article className="alert-summary-card alert-summary-card--critical">
          <span className="alert-summary-card__icon"><AlertOctagon size={20} aria-hidden="true" /></span>
          <div><span>Active Critical</span><strong>{summary.critical}</strong><small>ต้องตรวจสอบทันที</small></div>
        </article>
        <article className="alert-summary-card alert-summary-card--acknowledged">
          <span className="alert-summary-card__icon"><Clock3 size={20} aria-hidden="true" /></span>
          <div><span>Acknowledged</span><strong>{summary.acknowledged}</strong><small>กำลังดำเนินการ</small></div>
        </article>
        <article className="alert-summary-card alert-summary-card--resolved">
          <span className="alert-summary-card__icon"><CheckCircle2 size={20} aria-hidden="true" /></span>
          <div><span>Resolved</span><strong>{summary.resolved}</strong><small>ปิดเหตุการณ์แล้ว</small></div>
        </article>
      </div>

      <div className="alert-toolbar">
        <label className="alert-filter">
          <span>Severity</span>
          <select name="severity" value={filters.severity} onChange={updateFilter}>
            <option value="ALL">ทุกระดับ</option>
            {ALERT_SEVERITIES.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
          </select>
        </label>
        <label className="alert-filter">
          <span>Alert Type</span>
          <select name="type" value={filters.type} onChange={updateFilter}>
            <option value="ALL">ทุกประเภท</option>
            {Object.entries(ALERT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="alert-filter">
          <span>Status</span>
          <select name="status" value={filters.status} onChange={updateFilter}>
            <option value="ALL">ทุกสถานะ</option>
            {ALERT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="alert-filter">
          <span>Device</span>
          <select name="deviceId" value={filters.deviceId} onChange={updateFilter}>
            <option value="ALL">ทุกอุปกรณ์</option>
            {devices.map((device) => <option key={device.id} value={device.id}>{device.serialNumber}</option>)}
          </select>
        </label>
        <label className="alert-filter">
          <span>Model</span>
          <select name="model" value={filters.model} onChange={updateFilter}>
            <option value="ALL">ทุกรุ่น</option>
            <option value="LPG365">LPG365</option>
            <option value="LPG365-P">LPG365-P</option>
          </select>
        </label>
        {hasFilters ? (
          <button className="secondary-button alert-clear-button" type="button" onClick={() => setFilters(DEFAULT_ALERT_FILTERS)}>
            <FilterX size={17} aria-hidden="true" />ล้างตัวกรอง
          </button>
        ) : null}
      </div>

      <div className="alert-results-heading">
        <div><h3>รายการ Incident</h3><p>พบ {filteredItems.length} จาก {allItems.length} รายการ</p></div>
        <span>เวลา Asia/Bangkok · ข้อมูลจำลอง</span>
      </div>

      {filteredItems.length > 0 ? (
        <>
          <div className="alert-table-card">
            <div className="alert-table-scroll">
              <table className="alert-table">
                <thead>
                  <tr>
                    <th>Incident</th>
                    <th>Device / Location</th>
                    <th>Sensor</th>
                    <th>Valve Action</th>
                    <th>Status / Time</th>
                    <th><span className="sr-only">การทำงาน</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const { alert, device, sensor, valveCommand } = item
                    const selected = alert.id === selectedAlertId

                    return (
                      <tr
                        key={alert.id}
                        data-alert-id={alert.id}
                        className={`alert-table__row alert-table__row--${alert.severity.toLowerCase()}${selected ? ' alert-table__row--selected' : ''}`}
                      >
                        <td>
                          <div className="alert-table__incident">
                            <StatusBadge status={alert.severity} />
                            <strong>{alert.title}</strong>
                            <span>{ALERT_TYPE_LABELS[alert.type] ?? alert.type}</span>
                            <small>{alert.message}</small>
                          </div>
                        </td>
                        <td>
                          <div className="alert-table__meta">
                            {device ? <Link to={`/admin/devices/${device.id}`}>{device.serialNumber} · {device.model}</Link> : <strong>ไม่พบอุปกรณ์</strong>}
                            <span><MapPin size={14} aria-hidden="true" />{device?.location ?? 'ไม่พบสถานที่'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="alert-table__meta">
                            <span><Radio size={14} aria-hidden="true" />{sensor?.name ?? 'ไม่เกี่ยวข้องกับ Sensor'}</span>
                            {sensor ? <small>{sensor.zone}</small> : null}
                          </div>
                        </td>
                        <td>
                          <span className={`alert-valve-action${valveCommand ? ' alert-valve-action--automatic' : ''}`}>
                            <Bot size={15} aria-hidden="true" />{getValveActionLabel(valveCommand)}
                          </span>
                        </td>
                        <td>
                          <div className="alert-table__status">
                            <StatusBadge status={alert.status} />
                            <small>{formatDateTime(alert.createdAt)}</small>
                          </div>
                        </td>
                        <td>
                          <div className="alert-table__actions">
                            {alert.status === 'OPEN' ? <button className="primary-button" type="button" onClick={() => handleAcknowledge(alert.id)}>Acknowledge</button> : null}
                            {alert.status === 'ACKNOWLEDGED' ? <button className="primary-button" type="button" onClick={() => setResolveItem(item)}>Resolve</button> : null}
                            {alert.status === 'RESOLVED' ? <span>ดำเนินการแล้ว</span> : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert-mobile-list">
            {filteredItems.map((item) => (
              <div
                key={item.alert.id}
                data-alert-id={item.alert.id}
              >
                <AlertIncidentCard
                  item={item}
                  selected={item.alert.id === selectedAlertId}
                  onAcknowledge={handleAcknowledge}
                  onResolve={setResolveItem}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alerts-empty-state">
          <BellRing size={29} aria-hidden="true" />
          <h3>ไม่พบ Incident ที่ตรงกับตัวกรอง</h3>
          <p>ลองเปลี่ยน Severity, Type, Status, Device หรือ Model</p>
          {hasFilters ? <button className="secondary-button" type="button" onClick={() => setFilters(DEFAULT_ALERT_FILTERS)}>ล้างตัวกรอง</button> : null}
        </div>
      )}

      {resolveItem ? (
        <ResolveAlertModal
          item={resolveItem}
          onClose={closeResolveModal}
          onResolve={handleResolve}
        />
      ) : null}
    </section>
  )
}
