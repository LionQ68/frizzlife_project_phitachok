import { ArrowRight, Database } from 'lucide-react'

export function PagePlaceholder({ description, eyebrow, icon: Icon, title }) {
  return (
    <section className="placeholder-page" aria-labelledby="page-title">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">{eyebrow}</span>
          <h2 id="page-title">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="page-heading__icon" aria-hidden="true">
          <Icon size={28} />
        </div>
      </div>

      <div className="placeholder-panel">
        <div className="placeholder-panel__icon" aria-hidden="true">
          <Database size={26} />
        </div>
        <div>
          <span className="placeholder-label">ROUTE READY</span>
          <h3>โครงหน้าพร้อมเชื่อมข้อมูลส่วนกลาง</h3>
          <p>
            Navigation, Session และสิทธิ์การเข้าถึงหน้านี้ทำงานแล้ว
            ส่วนข้อมูลและ Interaction จะเพิ่มตาม Phase ของฟีเจอร์นั้น
          </p>
        </div>
        <ArrowRight className="placeholder-arrow" size={22} aria-hidden="true" />
      </div>
    </section>
  )
}
