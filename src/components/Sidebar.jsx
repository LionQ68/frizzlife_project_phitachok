import { Droplets, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useFocusTrap } from '../hooks/useFocusTrap.js'

export function Sidebar({ isMobile, isOpen, items, onClose, role }) {
  const sidebarRef = useFocusTrap({
    active: isMobile && isOpen,
    onClose,
  })

  return (
    <aside
      ref={sidebarRef}
      id="primary-navigation"
      className={`shell-sidebar${isOpen ? ' shell-sidebar--open' : ''}`}
      aria-label="เมนูหลัก"
      aria-hidden={isMobile ? !isOpen : undefined}
      aria-modal={isMobile && isOpen ? 'true' : undefined}
      inert={isMobile && !isOpen ? true : undefined}
      role={isMobile && isOpen ? 'dialog' : undefined}
      tabIndex={-1}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand__mark" aria-hidden="true">
          <Droplets size={24} strokeWidth={2.2} />
        </div>
        <div>
          <strong>Frizzlife</strong>
          <span>Smart Water</span>
        </div>
        <button
          className="icon-button sidebar-close"
          type="button"
          aria-label="ปิดเมนู"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>

      <div className="sidebar-section-label">
        {role === 'ADMIN' ? 'เมนูผู้ดูแลระบบ' : 'ระบบน้ำของฉัน'}
      </div>

      <nav className="sidebar-nav">
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            className={({ isActive }) => (
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            )}
            to={to}
            onClick={onClose}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-demo-note">
        <span className="status-dot" aria-hidden="true" />
        <div>
          <strong>สภาพแวดล้อมสาธิต</strong>
          <span>ข้อมูลจำลอง ไม่มีอุปกรณ์จริง</span>
        </div>
      </div>
    </aside>
  )
}
