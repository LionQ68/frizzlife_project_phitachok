import { MapPin, Radio, X } from 'lucide-react'
import { useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'

export function SensorEditModal({ sensor, onClose, onSave }) {
  const [form, setForm] = useState({ name: sensor.name, zone: sensor.zone })
  const [error, setError] = useState('')
  const modalRef = useFocusTrap({ onClose })

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
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
      <section ref={modalRef} className="sensor-edit-modal" role="dialog" aria-modal="true" aria-labelledby="sensor-edit-title">
        <div className="sensor-edit-modal__heading">
          <div className="sensor-edit-modal__icon"><Radio size={22} aria-hidden="true" /></div>
          <div>
            <span className="devices-eyebrow">ตั้งค่า Sensor ของฉัน</span>
            <h2 id="sensor-edit-title">แก้ไขข้อมูล Sensor</h2>
            <p>แก้ได้เฉพาะชื่อและตำแหน่งติดตั้ง สถานะการตรวจจับยังมาจากข้อมูลจำลอง</p>
          </div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่างแก้ไข Sensor" onClick={onClose}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <form className="sensor-edit-form" onSubmit={handleSubmit}>
          <label className="device-form__field">
            <span>ชื่อ Sensor</span>
            <input name="name" value={form.name} maxLength="60" autoFocus onChange={updateField} />
          </label>
          <label className="device-form__field">
            <span><MapPin size={14} aria-hidden="true" />ตำแหน่งติดตั้ง</span>
            <input name="zone" value={form.zone} maxLength="80" onChange={updateField} />
          </label>

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="sensor-edit-form__actions">
            <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
            <button className="primary-button" type="submit">บันทึกการแก้ไข</button>
          </div>
        </form>
      </section>
    </div>
  )
}
