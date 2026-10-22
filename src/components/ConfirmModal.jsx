import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'

function getDefaultReason(command) {
  return command === 'OPEN'
    ? 'เปิดวาล์วหลังตรวจสอบความปลอดภัยแล้ว'
    : 'ปิดวาล์วจากหน้า Device Detail'
}

export function ConfirmModal({ command, device, onClose, onConfirm }) {
  const [reason, setReason] = useState(() => getDefaultReason(command))
  const [error, setError] = useState('')
  const isOpenCommand = command === 'OPEN'
  const modalRef = useFocusTrap({ onClose })

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onConfirm(reason)

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
      <section ref={modalRef} className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-valve-title">
        <div className={`confirm-modal__icon${isOpenCommand ? '' : ' confirm-modal__icon--close'}`}>
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <button className="icon-button confirm-modal__dismiss" type="button" aria-label="ปิดหน้าต่างยืนยัน" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
        <span className="devices-eyebrow">คำสั่งวาล์วจำลอง</span>
        <h2 id="confirm-valve-title">ยืนยัน{isOpenCommand ? 'เปิด' : 'ปิด'}วาล์ว</h2>
        <p>
          กำลังส่งคำสั่งจำลองไปยัง <strong>{device.serialNumber}</strong> ไม่มีการเชื่อมต่อหรือควบคุมอุปกรณ์จริง
        </p>

        {isOpenCommand ? (
          <div className="confirm-modal__safety-note">
            โปรดยืนยันว่าตรวจสอบพื้นที่แล้ว ไม่มีน้ำรั่ว และสามารถเปิดน้ำได้อย่างปลอดภัย
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <label className="confirm-modal__field">
            <span>เหตุผลประกอบคำสั่ง (ไม่บังคับ)</span>
            <textarea value={reason} rows="3" onChange={(event) => { setReason(event.target.value); setError('') }} />
          </label>

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="confirm-modal__actions">
            <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
            <button className={`primary-button${isOpenCommand ? '' : ' primary-button--danger'}`} type="submit">
              ยืนยัน{isOpenCommand ? 'เปิด' : 'ปิด'}วาล์ว
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
