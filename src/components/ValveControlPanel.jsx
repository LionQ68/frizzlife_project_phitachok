import { LockKeyhole, Power, ShieldAlert, Waves } from 'lucide-react'
import { useCallback, useState } from 'react'
import { getValveCommandAvailability } from '../services/valveService.js'
import { ConfirmModal } from './ConfirmModal.jsx'
import { StatusBadge } from './StatusBadge.jsx'

export function ValveControlPanel({ appState, device, onRequestCommand }) {
  const [pendingCommand, setPendingCommand] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const openPermission = getValveCommandAvailability(appState, device.id, 'OPEN')
  const closePermission = getValveCommandAvailability(appState, device.id, 'CLOSE')
  const closeModal = useCallback(() => setPendingCommand(null), [])

  const handleConfirm = (reason) => {
    const result = onRequestCommand(device.id, pendingCommand, reason)
    setFeedback({ success: result.success, message: result.message })
    return result
  }

  const openBlockedBySafety = ['ACTIVE_LEAK', 'ACTIVE_CRITICAL_ALERT'].includes(
    openPermission.code,
  )

  return (
    <article className="valve-control-panel">
      <div className="device-detail-panel__heading">
        <div>
          <span className="devices-eyebrow">SAFE VALVE CONTROL</span>
          <h3>ควบคุมวาล์ว</h3>
        </div>
        <StatusBadge status={device.valveStatus} />
      </div>

      <div className={`valve-visual${device.valveStatus === 'OPEN' ? ' valve-visual--open' : ''}`}>
        <span><Waves size={25} aria-hidden="true" /></span>
        <div>
          <small>สถานะปัจจุบัน</small>
          <strong>Valve {device.valveStatus === 'OPEN' ? 'Open' : 'Closed'}</strong>
        </div>
        <span className="valve-visual__demo">SIMULATED</span>
      </div>

      <div className={`valve-safety-message${openBlockedBySafety ? ' valve-safety-message--critical' : ''}`}>
        {openBlockedBySafety
          ? <ShieldAlert size={19} aria-hidden="true" />
          : <LockKeyhole size={19} aria-hidden="true" />}
        <div>
          <strong>{openPermission.allowed ? 'พร้อมรับคำสั่งเปิดวาล์ว' : 'เปิดวาล์วไม่ได้'}</strong>
          <span>{openPermission.message}</span>
        </div>
      </div>

      <div className="valve-control-actions">
        <button
          className="valve-action valve-action--open"
          type="button"
          disabled={!openPermission.allowed}
          title={!openPermission.allowed ? openPermission.message : undefined}
          onClick={() => { setFeedback(null); setPendingCommand('OPEN') }}
        >
          <Power size={18} aria-hidden="true" />
          เปิดวาล์ว
        </button>
        <button
          className="valve-action valve-action--close"
          type="button"
          disabled={!closePermission.allowed}
          title={!closePermission.allowed ? closePermission.message : undefined}
          onClick={() => { setFeedback(null); setPendingCommand('CLOSE') }}
        >
          <LockKeyhole size={18} aria-hidden="true" />
          ปิดวาล์ว
        </button>
      </div>

      {!closePermission.allowed && closePermission.code !== 'VALVE_ALREADY_CLOSED' ? (
        <p className="valve-control-hint">ปิดวาล์วไม่ได้: {closePermission.message}</p>
      ) : null}

      {feedback ? (
        <div className={`valve-feedback${feedback.success ? '' : ' valve-feedback--error'}`} role={feedback.success ? 'status' : 'alert'}>
          {feedback.message}
        </div>
      ) : null}

      {pendingCommand ? (
        <ConfirmModal
          command={pendingCommand}
          device={device}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      ) : null}
    </article>
  )
}
