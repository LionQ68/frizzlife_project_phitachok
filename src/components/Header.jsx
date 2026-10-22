import { Database, LogOut, Menu } from 'lucide-react'

export function Header({
  currentUser,
  isNavigationOpen,
  onLogout,
  onMenuClick,
  pageTitle,
}) {
  const roleLabel = currentUser.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'
  const initial = currentUser.name?.trim().charAt(0) || 'U'

  return (
    <header className="shell-header">
      <div className="header-title-group">
        <button
          className="icon-button menu-button"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isNavigationOpen}
          aria-label="เปิดเมนู"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <div>
          <span className="header-eyebrow">ระบบจัดการน้ำ</span>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="header-actions">
        <div className="demo-badge" title="ข้อมูลทั้งหมดเป็นข้อมูลจำลอง">
          <Database size={16} aria-hidden="true" />
          <span>ข้อมูลจำลอง</span>
        </div>

        <div className="user-summary">
          <span className="user-avatar" aria-hidden="true">{initial}</span>
          <div>
            <strong>{currentUser.name}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={onLogout}
          aria-label="ออกจากระบบ"
          title="ออกจากระบบ"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </header>
  )
}
