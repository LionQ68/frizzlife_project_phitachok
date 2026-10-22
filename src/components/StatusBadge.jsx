const STATUS_CONFIG = {
  ONLINE: { label: 'Online', tone: 'success' },
  OFFLINE: { label: 'Offline', tone: 'neutral' },
  WARNING: { label: 'Warning', tone: 'warning' },
  CRITICAL: { label: 'Critical', tone: 'critical' },
  INFO: { label: 'Info', tone: 'info' },
  OPEN: { label: 'Open', tone: 'critical' },
  ACKNOWLEDGED: { label: 'Acknowledged', tone: 'warning' },
  RESOLVED: { label: 'Resolved', tone: 'success' },
  CLOSED: { label: 'Closed', tone: 'neutral' },
  CLOSING: { label: 'Closing', tone: 'warning' },
  OPENING: { label: 'Opening', tone: 'info' },
  SUCCESS: { label: 'Success', tone: 'success' },
  FAILED: { label: 'Failed', tone: 'critical' },
  PENDING: { label: 'Pending', tone: 'warning' },
  NORMAL: { label: 'Normal', tone: 'success' },
  LEAK: { label: 'Leak Detected', tone: 'critical' },
  ACTIVE: { label: 'ใช้งาน', tone: 'success' },
  SUSPENDED: { label: 'ระงับ', tone: 'critical' },
}

export function StatusBadge({ status, label, tone }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status ?? 'Unknown',
    tone: 'neutral',
  }

  return (
    <span className={`status-badge status-badge--${tone ?? config.tone}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {label ?? config.label}
    </span>
  )
}
