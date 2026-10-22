import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'

const STATE_CONFIG = Object.freeze({
  loading: { icon: LoaderCircle, role: 'status' },
  empty: { icon: Inbox, role: 'status' },
  error: { icon: AlertTriangle, role: 'alert' },
})

export function PageState({
  action,
  description,
  title,
  type = 'empty',
}) {
  const config = STATE_CONFIG[type] ?? STATE_CONFIG.empty
  const Icon = config.icon

  return (
    <section
      className={`page-state page-state--${type}`}
      role={config.role}
      aria-live={type === 'loading' ? 'polite' : undefined}
      aria-busy={type === 'loading' ? 'true' : undefined}
    >
      <span className="page-state__icon">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="page-state__action">{action}</div> : null}
    </section>
  )
}
