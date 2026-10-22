import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { ALERT_TYPE_LABELS } from '../utils/alertSelectors.js'
import { formatDateTime } from '../utils/formatters.js'
import { StatusBadge } from './StatusBadge.jsx'

export function ResolveAlertModal({ item, onClose, onResolve }) {
  const [resolutionNote, setResolutionNote] = useState('')
  const [error, setError] = useState('')
  const { alert, device, sensor } = item
  const modalRef = useFocusTrap({ onClose })

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!resolutionNote.trim()) {
      setError('กรุณาระบุรายละเอียดการแก้ไข')
      return
    }

    const result = onResolve(alert.id, resolutionNote)

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
        className="resolve-alert-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-alert-title"
      >
        <div className="resolve-alert-modal__heading">
          <div>
            <span className="devices-eyebrow">ปิดเหตุการณ์</span>
            <h2 id="resolve-alert-title">ปิด Incident นี้หรือไม่?</h2>
            <p>การ Resolve จะไม่เปิดวาล์วโดยอัตโนมัติ</p>
          </div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่าง" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="resolve-alert-form" onSubmit={handleSubmit}>
          <div className="resolve-alert-summary">
            <span className="resolve-alert-summary__icon"><AlertTriangle size={21} aria-hidden="true" /></span>
            <div>
              <div className="resolve-alert-summary__title">
                <strong>{alert.title}</strong>
                <StatusBadge status={alert.severity} />
              </div>
              <p>{device?.serialNumber ?? 'ไม่พบอุปกรณ์'} · {device?.model ?? 'ไม่ทราบรุ่น'}</p>
              <span>{ALERT_TYPE_LABELS[alert.type] ?? alert.type}{sensor ? ` · ${sensor.name}` : ''} · {formatDateTime(alert.createdAt)}</span>
            </div>
          </div>

          <label className="resolve-alert-field">
            <span>Resolution Note *</span>
            <textarea
              autoFocus
              rows="4"
              value={resolutionNote}
              placeholder="อธิบายสิ่งที่ตรวจสอบหรือวิธีแก้ไขเหตุการณ์"
              onChange={(event) => {
                setResolutionNote(event.target.value)
                setError('')
              }}
            />
          </label>

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="resolve-alert-form__actions">
            <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
            <button className="primary-button" type="submit">ยืนยันการ Resolve</button>
          </div>
        </form>
      </section>
    </div>
  )
}
