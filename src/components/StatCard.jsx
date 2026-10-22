export function StatCard({ icon: Icon, label, value, helper, tone = 'primary' }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={2.1} />
      </div>
      <div>
        <p className="stat-card__label">{label}</p>
        <strong className="stat-card__value">{value}</strong>
        <p className="stat-card__helper">{helper}</p>
      </div>
    </article>
  )
}
