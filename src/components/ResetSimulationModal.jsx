import { RotateCcw, X } from 'lucide-react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'

export function ResetSimulationModal({ onClose, onConfirm }) {
  const modalRef = useFocusTrap({ onClose })

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section ref={modalRef} className="reset-simulation-modal" role="dialog" aria-modal="true" aria-labelledby="reset-simulation-title">
        <div className="reset-simulation-modal__heading">
          <span className="reset-simulation-modal__icon"><RotateCcw size={23} aria-hidden="true" /></span>
          <div><span className="devices-eyebrow">คืนข้อมูลจำลอง</span><h2 id="reset-simulation-title">คืนข้อมูลจำลองทั้งหมดหรือไม่?</h2></div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่าง" onClick={onClose}><X size={20} aria-hidden="true" /></button>
        </div>

        <div className="reset-simulation-modal__body">
          <p>การ Reset จะคืนข้อมูลต่อไปนี้เป็นค่าเริ่มต้น:</p>
          <ul>
            <li>Users และ Devices รวมถึงอุปกรณ์ Demo ที่เพิ่มเอง</li>
            <li>Leak Sensors และ Telemetry ย้อนหลัง</li>
            <li>Alerts, Valve History และ Event Log</li>
          </ul>
          <div className="reset-simulation-modal__notice"><strong>Session จะยังคงอยู่</strong><span>คุณจะยัง Login ด้วยบัญชีเดิมหลัง Reset</span></div>
          <p className="reset-simulation-modal__warning">การดำเนินการนี้ไม่สามารถย้อนกลับได้ใน Browser ปัจจุบัน</p>
        </div>

        <div className="reset-simulation-modal__actions">
          <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
          <button className="primary-button primary-button--danger" type="button" onClick={onConfirm}>ยืนยัน Reset Demo Data</button>
        </div>
      </section>
    </div>
  )
}
