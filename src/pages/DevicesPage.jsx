import {
  CircleGauge,
  FilterX,
  MapPin,
  Pencil,
  Plus,
  Search,
  Thermometer,
  UserRound,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DeviceCard } from '../components/DeviceCard.jsx'
import { DeviceFormModal } from '../components/DeviceFormModal.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { createDeviceListItems, filterDevices } from '../utils/deviceFilters.js'
import {
  formatFlowRate,
  formatPressure,
  formatRelativeTime,
  formatTemperature,
} from '../utils/formatters.js'

const DEFAULT_FILTERS = Object.freeze({
  query: '',
  status: 'ALL',
  model: 'ALL',
})

function getSpecificMetric(device, latestTelemetry) {
  if (!latestTelemetry) {
    return 'ยังไม่มีข้อมูล'
  }

  return device.capabilities.temperature
    ? formatTemperature(latestTelemetry.temperature)
    : formatPressure(latestTelemetry.pressure)
}

export function DevicesPage() {
  const {
    devices,
    telemetry,
    users,
    addDevice,
    updateDevice,
  } = useAppContext()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [formState, setFormState] = useState(null)
  const [feedback, setFeedback] = useState('')

  const demoUsers = useMemo(
    () => users.filter(({ role }) => role === 'USER'),
    [users],
  )
  const filteredDevices = useMemo(
    () => filterDevices(devices, filters),
    [devices, filters],
  )
  const deviceItems = useMemo(
    () => createDeviceListItems(filteredDevices, telemetry, users),
    [filteredDevices, telemetry, users],
  )
  const summary = useMemo(() => ({
    total: devices.length,
    online: devices.filter(({ status }) => status === 'ONLINE').length,
    attention: devices.filter(({ status }) => status === 'WARNING').length,
    offline: devices.filter(({ status }) => status === 'OFFLINE').length,
  }), [devices])
  const hasActiveFilters = Boolean(
    filters.query || filters.status !== 'ALL' || filters.model !== 'ALL',
  )

  const closeForm = useCallback(() => setFormState(null), [])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  const handleSave = (form) => {
    const result = formState?.device
      ? updateDevice(formState.device.id, form)
      : addDevice(form)

    if (result.success) {
      setFeedback(result.message)
    }

    return result
  }

  return (
    <section className="devices-page">
      <div className="devices-heading">
        <div>
          <span className="devices-eyebrow">DEVICE MANAGEMENT · DEMO DATA</span>
          <h2>จัดการอุปกรณ์</h2>
          <p>ค้นหา เพิ่ม และแก้ไขอุปกรณ์ LPG365 Series จากข้อมูลจำลองภายใน Browser</p>
        </div>
        <button className="primary-button devices-add-button" type="button" onClick={() => setFormState({ device: null })}>
          <Plus size={18} aria-hidden="true" />
          เพิ่มอุปกรณ์
        </button>
      </div>

      {feedback ? (
        <div className="devices-feedback" role="status">
          {feedback}
          <button type="button" onClick={() => setFeedback('')}>ปิด</button>
        </div>
      ) : null}

      <div className="device-summary-strip" aria-label="สรุปสถานะอุปกรณ์">
        <div><span>อุปกรณ์ทั้งหมด</span><strong>{summary.total}</strong></div>
        <div><span>Online</span><strong>{summary.online}</strong></div>
        <div><span>ต้องตรวจสอบ</span><strong>{summary.attention}</strong></div>
        <div><span>Offline</span><strong>{summary.offline}</strong></div>
      </div>

      <div className="device-toolbar">
        <label className="device-search">
          <span className="sr-only">ค้นหาอุปกรณ์</span>
          <Search size={18} aria-hidden="true" />
          <input
            name="query"
            value={filters.query}
            placeholder="ค้นหา Serial, ชื่อ, ลูกค้า หรือสถานที่"
            onChange={updateFilter}
          />
        </label>
        <label className="device-filter">
          <span>Status</span>
          <select name="status" value={filters.status} onChange={updateFilter}>
            <option value="ALL">ทุกสถานะ</option>
            <option value="ONLINE">Online</option>
            <option value="WARNING">Warning</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </label>
        <label className="device-filter">
          <span>Model</span>
          <select name="model" value={filters.model} onChange={updateFilter}>
            <option value="ALL">ทุกรุ่น</option>
            <option value="LPG365">LPG365</option>
            <option value="LPG365-P">LPG365-P</option>
          </select>
        </label>
        {hasActiveFilters ? (
          <button className="secondary-button device-clear-button" type="button" onClick={clearFilters}>
            <FilterX size={17} aria-hidden="true" />
            ล้างตัวกรอง
          </button>
        ) : null}
      </div>

      <div className="device-results-heading">
        <div>
          <h3>รายการอุปกรณ์</h3>
          <p>พบ {deviceItems.length} จาก {devices.length} เครื่อง</p>
        </div>
        <span>ข้อมูลทั้งหมดเป็นข้อมูลจำลอง</span>
      </div>

      {deviceItems.length > 0 ? (
        <>
          <div className="device-table-card">
            <div className="device-table-scroll">
              <table className="device-table">
                <thead>
                  <tr>
                    <th>อุปกรณ์</th>
                    <th>User / สถานที่</th>
                    <th>การเชื่อมต่อ</th>
                    <th>Valve</th>
                    <th>Flow</th>
                    <th>ค่าตามรุ่น</th>
                    <th><span className="sr-only">การทำงาน</span></th>
                  </tr>
                </thead>
                <tbody>
                  {deviceItems.map(({ device, latestTelemetry, assignedUser }) => {
                    const MetricIcon = device.capabilities.temperature ? Thermometer : CircleGauge

                    return (
                      <tr key={device.id}>
                        <td>
                          <div className="device-table__identity">
                            <span className={`model-badge model-badge--${device.capabilities.temperature ? 'temperature' : 'pressure'}`}>
                              {device.model}
                            </span>
                            <Link to={`/admin/devices/${device.id}`}>{device.serialNumber}</Link>
                            <small>{device.name}</small>
                          </div>
                        </td>
                        <td>
                          <div className="device-table__meta">
                            <span><UserRound size={14} aria-hidden="true" />{assignedUser?.name ?? 'ยังไม่ผูก User'}</span>
                            <span><MapPin size={14} aria-hidden="true" />{device.location}</span>
                          </div>
                        </td>
                        <td>
                          <div className="device-table__stack">
                            <StatusBadge status={device.status} />
                            <small>ติดต่อ {formatRelativeTime(device.lastSeenAt)}</small>
                          </div>
                        </td>
                        <td><StatusBadge status={device.valveStatus} /></td>
                        <td>{latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ยังไม่มีข้อมูล'}</td>
                        <td>
                          <span className="device-specific-metric">
                            <MetricIcon size={16} aria-hidden="true" />
                            {getSpecificMetric(device, latestTelemetry)}
                          </span>
                        </td>
                        <td>
                          <div className="device-table__actions">
                            <Link className="secondary-link" to={`/admin/devices/${device.id}`}>รายละเอียด</Link>
                            <button className="icon-button" type="button" aria-label={`แก้ไข ${device.serialNumber}`} onClick={() => setFormState({ device })}>
                              <Pencil size={17} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="devices-mobile-list">
            {deviceItems.map((item) => (
              <DeviceCard
                key={item.device.id}
                item={item}
                onEdit={(device) => setFormState({ device })}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="devices-empty-state">
          <Search size={28} aria-hidden="true" />
          <h3>ไม่พบอุปกรณ์ที่ตรงกับเงื่อนไข</h3>
          <p>ลองเปลี่ยนคำค้นหา สถานะ หรือรุ่นอุปกรณ์</p>
          {hasActiveFilters ? <button className="secondary-button" type="button" onClick={clearFilters}>ล้างตัวกรอง</button> : null}
        </div>
      )}

      {formState ? (
        <DeviceFormModal
          device={formState.device}
          users={demoUsers}
          onClose={closeForm}
          onSave={handleSave}
        />
      ) : null}
    </section>
  )
}
