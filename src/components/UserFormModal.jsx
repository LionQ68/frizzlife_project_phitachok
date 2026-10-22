import {
  AlertTriangle,
  Check,
  Mail,
  Router,
  UserRound,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'

function createInitialForm(user, devices) {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    accountStatus: user?.accountStatus ?? 'ACTIVE',
    assignedDeviceIds: user
      ? devices.filter(({ assignedUserId }) => assignedUserId === user.id).map(({ id }) => id)
      : [],
  }
}

export function UserFormModal({ devices, user, users, onClose, onSave }) {
  const [form, setForm] = useState(() => createInitialForm(user, devices))
  const [error, setError] = useState('')
  const [confirmingMove, setConfirmingMove] = useState(false)
  const isEditing = Boolean(user)
  const modalRef = useFocusTrap({ onClose })
  const ownersById = useMemo(
    () => new Map(users.map((item) => [item.id, item])),
    [users],
  )
  const conflicts = devices.filter((device) => (
    form.assignedDeviceIds.includes(device.id)
    && device.assignedUserId
    && device.assignedUserId !== user?.id
  ))

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setConfirmingMove(false)
  }

  const toggleDevice = (deviceId) => {
    setForm((current) => ({
      ...current,
      assignedDeviceIds: current.assignedDeviceIds.includes(deviceId)
        ? current.assignedDeviceIds.filter((id) => id !== deviceId)
        : [...current.assignedDeviceIds, deviceId],
    }))
    setError('')
    setConfirmingMove(false)
  }

  const saveUser = () => {
    const result = onSave(form)

    if (!result.success) {
      setError(result.message)
      setConfirmingMove(false)
      return
    }

    onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (conflicts.length > 0 && !confirmingMove) {
      setConfirmingMove(true)
      return
    }

    saveUser()
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
        className="user-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <header className="user-form-modal__heading">
          <div className="user-form-modal__title">
            <span className="user-form-modal__icon" aria-hidden="true"><UserRound size={22} /></span>
            <div>
              <span className="devices-eyebrow">บัญชีผู้ใช้จำลอง</span>
              <h2 id="user-form-title">{isEditing ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้'}</h2>
              <p>จัดการข้อมูลบัญชีและอุปกรณ์ที่ผู้ใช้มองเห็นใน Dashboard</p>
            </div>
          </div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่างจัดการผู้ใช้" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form className="user-form" onSubmit={handleSubmit} noValidate>
          <div className="user-form__grid">
            <label className="user-form__field">
              <span><UserRound size={15} aria-hidden="true" />ชื่อผู้ใช้ *</span>
              <input
                autoFocus
                name="name"
                value={form.name}
                maxLength="80"
                placeholder="ชื่อผู้ใช้งานตัวอย่าง"
                onChange={updateField}
              />
            </label>
            <label className="user-form__field">
              <span><Mail size={15} aria-hidden="true" />Email *</span>
              <input
                name="email"
                type="email"
                value={form.email}
                maxLength="120"
                placeholder="user@frizzlife.demo"
                onChange={updateField}
              />
            </label>
            <label className="user-form__field user-form__field--status">
              <span>สถานะบัญชี</span>
              <select name="accountStatus" value={form.accountStatus} onChange={updateField}>
                <option value="ACTIVE">ใช้งาน</option>
                <option value="SUSPENDED">ระงับการใช้งาน</option>
              </select>
            </label>
          </div>

          {!isEditing ? (
            <div className="user-password-note">
              <Check size={18} aria-hidden="true" />
              <div><strong>รหัสผ่านเริ่มต้น: Demo1234</strong><span>ใช้สำหรับการสาธิตเท่านั้น ไม่ใช่ระบบรหัสผ่านจริง</span></div>
            </div>
          ) : null}

          <fieldset className="user-device-fieldset">
            <legend><Router size={18} aria-hidden="true" />อุปกรณ์ที่ผูกกับผู้ใช้</legend>
            <p>ผู้ใช้หนึ่งคนมีได้หลายเครื่อง แต่อุปกรณ์หนึ่งเครื่องผูกได้กับผู้ใช้เพียงคนเดียว</p>
            <div className="user-device-options">
              {devices.map((device) => {
                const checked = form.assignedDeviceIds.includes(device.id)
                const owner = ownersById.get(device.assignedUserId)
                const belongsToAnotherUser = owner && owner.id !== user?.id

                return (
                  <label className={`user-device-option${checked ? ' user-device-option--selected' : ''}`} key={device.id}>
                    <input type="checkbox" checked={checked} onChange={() => toggleDevice(device.id)} />
                    <span className="user-device-option__check"><Check size={15} aria-hidden="true" /></span>
                    <span className="user-device-option__copy">
                      <strong>{device.serialNumber} · {device.model}</strong>
                      <small>{device.location}</small>
                      <small>{owner ? `ผู้ใช้ปัจจุบัน: ${owner.name}` : 'ยังไม่ผูกผู้ใช้'}</small>
                    </span>
                    {belongsToAnotherUser && checked ? <span className="user-device-option__move">จะย้าย</span> : null}
                  </label>
                )
              })}
            </div>
          </fieldset>

          {confirmingMove ? (
            <div className="user-move-warning" role="alert">
              <AlertTriangle size={20} aria-hidden="true" />
              <div>
                <strong>ยืนยันการย้ายอุปกรณ์ {conflicts.length} เครื่อง</strong>
                <span>อุปกรณ์จะถูกยกเลิกจากผู้ใช้เดิมและผูกกับบัญชีนี้ทันที</span>
              </div>
            </div>
          ) : null}

          {error ? <div className="form-error" role="alert">{error}</div> : null}

          <div className="user-form__actions">
            <button className="secondary-button" type="button" onClick={onClose}>ยกเลิก</button>
            <button className={`primary-button${confirmingMove ? ' primary-button--warning' : ''}`} type="submit">
              {confirmingMove
                ? 'ยืนยันและย้ายอุปกรณ์'
                : isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

