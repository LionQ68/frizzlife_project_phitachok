import {
  FilterX,
  Mail,
  Pencil,
  Plus,
  Router,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  UserRoundX,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { UserFormModal } from '../components/UserFormModal.jsx'
import { useAppContext } from '../context/useAppContext.js'
import { formatDateTime } from '../utils/formatters.js'
import {
  createUserListItems,
  DEFAULT_USER_FILTERS,
  filterUserItems,
} from '../utils/userFilters.js'

function DeviceChips({ devices }) {
  if (devices.length === 0) {
    return <span className="user-unassigned">ยังไม่ผูกอุปกรณ์</span>
  }

  return (
    <div className="user-device-chips">
      {devices.map((device) => (
        <span className="user-device-chip" key={device.id}>
          <Router size={13} aria-hidden="true" />
          {device.serialNumber}
          <small>{device.model}</small>
        </span>
      ))}
    </div>
  )
}

function UserCard({ item, onEdit }) {
  const { devices, user } = item

  return (
    <article className="user-management-card">
      <div className="user-management-card__heading">
        <span className="managed-user-avatar" aria-hidden="true">{user.name.slice(0, 1)}</span>
        <div>
          <h3>{user.name}</h3>
          <span><Mail size={13} aria-hidden="true" />{user.email}</span>
        </div>
        <StatusBadge status={user.accountStatus} />
      </div>
      <DeviceChips devices={devices} />
      <div className="user-management-card__footer">
        <span>สร้างเมื่อ {formatDateTime(user.createdAt)}</span>
        <button className="secondary-button" type="button" onClick={() => onEdit(user)}>
          <Pencil size={15} aria-hidden="true" />แก้ไข
        </button>
      </div>
    </article>
  )
}

export function UsersPage() {
  const {
    addUser,
    devices,
    updateUser,
    users,
  } = useAppContext()
  const [filters, setFilters] = useState(DEFAULT_USER_FILTERS)
  const [formState, setFormState] = useState(null)
  const [feedback, setFeedback] = useState('')
  const allItems = useMemo(
    () => createUserListItems(users, devices),
    [devices, users],
  )
  const userItems = useMemo(
    () => filterUserItems(allItems, filters),
    [allItems, filters],
  )
  const summary = useMemo(() => ({
    total: allItems.length,
    active: allItems.filter(({ user }) => user.accountStatus === 'ACTIVE').length,
    suspended: allItems.filter(({ user }) => user.accountStatus === 'SUSPENDED').length,
    unassigned: allItems.filter(({ devices: assignedDevices }) => assignedDevices.length === 0).length,
  }), [allItems])
  const hasFilters = Boolean(
    filters.query || filters.status !== 'ALL' || filters.model !== 'ALL',
  )
  const closeForm = useCallback(() => setFormState(null), [])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const handleSave = (form) => {
    const result = formState?.user
      ? updateUser(formState.user.id, form)
      : addUser(form)

    if (result.success) {
      setFeedback(result.message)
    }

    return result
  }

  return (
    <section className="users-page">
      <header className="users-heading">
        <div>
          <span className="devices-eyebrow">USER MANAGEMENT · DEMO DATA</span>
          <h2>จัดการผู้ใช้และผูกอุปกรณ์</h2>
          <p>เพิ่ม แก้ไข ระงับบัญชี และกำหนดอุปกรณ์ LPG365 Series ที่ผู้ใช้แต่ละคนเข้าถึงได้</p>
        </div>
        <button className="primary-button users-add-button" type="button" onClick={() => setFormState({ user: null })}>
          <Plus size={18} aria-hidden="true" />เพิ่มผู้ใช้
        </button>
      </header>

      {feedback ? (
        <div className="devices-feedback" role="status">
          {feedback}
          <button type="button" onClick={() => setFeedback('')}>ปิด</button>
        </div>
      ) : null}

      <div className="user-summary-strip" aria-label="สรุปสถานะผู้ใช้">
        <div><span><UserRound size={17} aria-hidden="true" />ผู้ใช้ทั้งหมด</span><strong>{summary.total}</strong></div>
        <div><span><UserRoundCheck size={17} aria-hidden="true" />ใช้งาน</span><strong>{summary.active}</strong></div>
        <div><span><UserRoundX size={17} aria-hidden="true" />ระงับ</span><strong>{summary.suspended}</strong></div>
        <div><span><Router size={17} aria-hidden="true" />ยังไม่ผูกอุปกรณ์</span><strong>{summary.unassigned}</strong></div>
      </div>

      <div className="user-toolbar">
        <label className="user-search">
          <span className="sr-only">ค้นหาผู้ใช้</span>
          <Search size={18} aria-hidden="true" />
          <input
            name="query"
            value={filters.query}
            placeholder="ค้นหาชื่อหรือ Email"
            onChange={updateFilter}
          />
        </label>
        <label className="user-filter">
          <span>สถานะบัญชี</span>
          <select name="status" value={filters.status} onChange={updateFilter}>
            <option value="ALL">ทุกสถานะ</option>
            <option value="ACTIVE">ใช้งาน</option>
            <option value="SUSPENDED">ระงับ</option>
          </select>
        </label>
        <label className="user-filter">
          <span>รุ่นอุปกรณ์</span>
          <select name="model" value={filters.model} onChange={updateFilter}>
            <option value="ALL">ทุกรุ่น</option>
            <option value="LPG365">LPG365</option>
            <option value="LPG365-P">LPG365-P</option>
          </select>
        </label>
        {hasFilters ? (
          <button className="secondary-button user-clear-button" type="button" onClick={() => setFilters(DEFAULT_USER_FILTERS)}>
            <FilterX size={17} aria-hidden="true" />ล้างตัวกรอง
          </button>
        ) : null}
      </div>

      <div className="user-results-heading">
        <div><h3>บัญชีผู้ใช้</h3><p>พบ {userItems.length} จาก {allItems.length} บัญชี</p></div>
        <span><ShieldCheck size={14} aria-hidden="true" />Role ถูกกำหนดโดยระบบ</span>
      </div>

      {userItems.length > 0 ? (
        <>
          <div className="user-table-card">
            <div className="user-table-scroll">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ผู้ใช้</th>
                    <th>สถานะ</th>
                    <th>อุปกรณ์ที่ผูก</th>
                    <th>สร้างเมื่อ</th>
                    <th><span className="sr-only">การทำงาน</span></th>
                  </tr>
                </thead>
                <tbody>
                  {userItems.map(({ devices: assignedDevices, user }) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-table__identity">
                          <span className="managed-user-avatar" aria-hidden="true">{user.name.slice(0, 1)}</span>
                          <div><strong>{user.name}</strong><span><Mail size={13} aria-hidden="true" />{user.email}</span></div>
                        </div>
                      </td>
                      <td><StatusBadge status={user.accountStatus} /></td>
                      <td><DeviceChips devices={assignedDevices} /></td>
                      <td>{formatDateTime(user.createdAt)}</td>
                      <td>
                        <button className="icon-button" type="button" aria-label={`แก้ไข ${user.name}`} onClick={() => setFormState({ user })}>
                          <Pencil size={17} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="users-mobile-list">
            {userItems.map((item) => <UserCard item={item} key={item.user.id} onEdit={(user) => setFormState({ user })} />)}
          </div>
        </>
      ) : (
        <div className="users-empty-state">
          <Search size={28} aria-hidden="true" />
          <h3>ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</h3>
          <p>ลองเปลี่ยนคำค้นหา สถานะบัญชี หรือรุ่นอุปกรณ์</p>
          {hasFilters ? <button className="secondary-button" type="button" onClick={() => setFilters(DEFAULT_USER_FILTERS)}>ล้างตัวกรอง</button> : null}
        </div>
      )}

      {formState ? (
        <UserFormModal
          key={formState.user?.id ?? 'new-user'}
          devices={devices}
          user={formState.user}
          users={users}
          onClose={closeForm}
          onSave={handleSave}
        />
      ) : null}
    </section>
  )
}

