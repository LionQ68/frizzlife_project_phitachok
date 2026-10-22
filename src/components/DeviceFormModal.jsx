import { CircleGauge, Thermometer, X } from 'lucide-react'
import { useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { getDeviceCapabilities } from '../utils/deviceCapabilities.js'

function createInitialForm(device) {
  return {
    serialNumber: device?.serialNumber ?? '',
    name: device?.name ?? '',
    model: device?.model ?? 'LPG365-P',
    status: device?.status ?? 'ONLINE',
    assignedUserId: device?.assignedUserId ?? '',
    customerName: device?.customerName ?? '',
    location: device?.location ?? '',
    firmwareVersion: device?.firmwareVersion ?? 'DEMO-1.0.0',
    protectionEnabled: device?.protectionEnabled ?? true,
  }
}

export function DeviceFormModal({ device, users, onClose, onSave }) {
  const [form, setForm] = useState(() => createInitialForm(device))
  const [error, setError] = useState('')
  const isEditing = Boolean(device)
  const capabilities = getDeviceCapabilities(form.model)
  const modalRef = useFocusTrap({ onClose })

  const updateField = (event) => {
    const { name, type, value, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onSave(form)

    if (!result.success) {
      setError(result.message)
      return
    }

    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        ref={modalRef}
        className="device-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="device-form-title"
      >
        <div className="device-form-modal__heading">
          <div>
            <span className="devices-eyebrow">{isEditing ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์'}</span>
            <h2 id="device-form-title">{isEditing ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์จำลอง'}</h2>
            <p>ข้อมูลนี้ใช้สำหรับการสาธิตและจัดเก็บใน Browser เท่านั้น</p>
          </div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่าง" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="device-form" onSubmit={handleSubmit}>
          <div className="device-form__grid">
            <label className="device-form__field">
              <span>Serial Number *</span>
              <input
                autoFocus
                name="serialNumber"
                value={form.serialNumber}
                placeholder="เช่น LPG365-TH-004"
                onChange={updateField}
              />
            </label>
            <label className="device-form__field">
              <span>ชื่ออุปกรณ์ *</span>
              <input
                name="name"
                value={form.name}
                placeholder="เช่น Main Water Valve"
                onChange={updateField}
              />
            </label>
            <label className="device-form__field">
              <span>รุ่นอุปกรณ์ *</span>
              <select name="model" value={form.model} onChange={updateField}>
                <option value="LPG365">LPG365</option>
                <option value="LPG365-P">LPG365-P</option>
              </select>
            </label>
            <label className="device-form__field">
              <span>สถานะการเชื่อมต่อ</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option value="ONLINE">Online</option>
                <option value="WARNING">Warning</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </label>
            <label className="device-form__field">
              <span>ผู้ใช้ที่ผูกกับอุปกรณ์</span>
              <select name="assignedUserId" value={form.assignedUserId} onChange={updateField}>
                <option value="">ยังไม่ผูก User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name} · {user.email}</option>
                ))}
              </select>
            </label>
            <label className="device-form__field">
              <span>ชื่อลูกค้า</span>
              <input
                name="customerName"
                value={form.customerName}
                placeholder="ชื่อผู้ใช้งานหรือลูกค้า"
                onChange={updateField}
              />
            </label>
            <label className="device-form__field device-form__field--wide">
              <span>สถานที่ติดตั้ง *</span>
              <input
                name="location"
                value={form.location}
                placeholder="เช่น บ้านตัวอย่าง กรุงเทพฯ"
                onChange={updateField}
              />
            </label>
            <label className="device-form__field">
              <span>Firmware Version</span>
              <input
                name="firmwareVersion"
                value={form.firmwareVersion}
                placeholder="DEMO-1.0.0"
                onChange={updateField}
              />
            </label>
          </div>

          <div className="capability-preview">
            <div className={`capability-preview__icon${capabilities.temperature ? ' capability-preview__icon--temperature' : ''}`}>
              {capabilities.temperature
                ? <Thermometer size={21} aria-hidden="true" />
                : <CircleGauge size={21} aria-hidden="true" />}
            </div>
            <div>
              <strong>ความสามารถของ {form.model}</strong>
              <span>
                Flow · Usage · {capabilities.temperature ? 'Temperature' : 'Pressure'} · 3 Leak Sensors · Valve
              </span>
            </div>
          </div>

          <label className="protection-toggle">
            <input
              type="checkbox"
              name="protectionEnabled"
              checked={form.protectionEnabled}
              onChange={updateField}
            />
            <span>
              <strong>เปิดระบบป้องกัน</strong>
              <small>เปิดระบบป้องกันแบบจำลองสำหรับอุปกรณ์นี้</small>
            </span>
          </label>

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="device-form__actions">
            <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
            <button className="primary-button device-form__submit" type="submit">
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
