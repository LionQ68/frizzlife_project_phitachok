import {
  Activity,
  Droplets,
  Eye,
  EyeOff,
  Gauge,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'
import { getHomePathForRole } from '../utils/navigation.js'

const DEMO_ACCOUNTS = [
  {
    label: 'Admin Demo',
    description: 'ดูและจัดการอุปกรณ์ทั้งหมด',
    email: 'admin@frizzlife.demo',
  },
  {
    label: 'LPG365 User',
    description: 'Flow, Usage และ Temperature',
    email: 'user_365@frizzlife.demo',
  },
  {
    label: 'LPG365-P User',
    description: 'Flow, Usage และ Pressure',
    email: 'user_365p@frizzlife.demo',
  },
]

const DEMO_PASSWORD = 'Demo1234'

export function LoginPage() {
  const { currentUser, login } = useAppContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (currentUser) {
    return <Navigate to={getHomePathForRole(currentUser.role)} replace />
  }

  const fillDemoCredentials = (accountEmail) => {
    setEmail(accountEmail)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = login({ email, password })

    if (!result.success) {
      setError(result.message)
      setIsSubmitting(false)
      return
    }

    navigate(getHomePathForRole(result.user.role), { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="ข้อมูลระบบ">
        <div className="showcase-brand">
          <div className="showcase-brand__mark" aria-hidden="true">
            <Droplets size={29} />
          </div>
          <div>
            <strong>Frizzlife</strong>
            <span>SMART WATER MANAGEMENT</span>
          </div>
        </div>

        <div className="showcase-copy">
          <span className="showcase-eyebrow">SMART WATER. SAFER HOME.</span>
          <h1>มองเห็นทุกการใช้น้ำ<br />จัดการความเสี่ยงได้ทันเวลา</h1>
          <p>
            Dashboard ต้นแบบสำหรับตรวจสอบ LPG365 และ LPG365-P
            พร้อม Leak Sensors และระบบปิดวาล์วอัตโนมัติแบบจำลอง
          </p>
        </div>

        <div className="showcase-features">
          <div className="showcase-feature">
            <Activity size={21} aria-hidden="true" />
            <span>ติดตาม Flow และ Water Usage</span>
          </div>
          <div className="showcase-feature">
            <Gauge size={21} aria-hidden="true" />
            <span>แสดงค่าตาม Capability ของรุ่น</span>
          </div>
          <div className="showcase-feature">
            <ShieldCheck size={21} aria-hidden="true" />
            <span>จำลอง Leak Alert และ Auto Shutoff</span>
          </div>
        </div>

        <div className="showcase-disclaimer">
          Frontend Prototype — ไม่ได้เชื่อมต่อ Frizzlife Cloud หรืออุปกรณ์จริง
        </div>
      </section>

      <section className="login-workspace" aria-labelledby="login-title">
        <div className="login-card">
          <div className="login-heading">
            <span className="login-heading__icon" aria-hidden="true">
              <LockKeyhole size={22} />
            </span>
            <div>
              <span className="login-eyebrow">WELCOME BACK</span>
              <h2 id="login-title">เข้าสู่ระบบ Dashboard</h2>
            </div>
          </div>
          <p className="login-intro">
            ใช้บัญชี Demo เพื่อเข้าชมระบบ ระบบจะตรวจ Role และนำไปยังหน้าที่เหมาะสมอัตโนมัติ
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="form-field">
              <span>Email</span>
              <span className="input-shell">
                <Mail size={18} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  autoComplete="username"
                  placeholder="name@frizzlife.demo"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </span>
            </label>

            <label className="form-field">
              <span>Password</span>
              <span className="input-shell">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  placeholder="กรอก Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? 'ซ่อน Password' : 'แสดง Password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="demo-divider"><span>DEMO ONLY</span></div>
          <div className="demo-section">
            <div className="demo-section__heading">
              <div>
                <h3>บัญชีสำหรับทดลอง</h3>
                <p>เลือกเพื่อกรอกข้อมูล แล้วกดเข้าสู่ระบบด้านบน</p>
              </div>
              <span className="demo-password">Password: {DEMO_PASSWORD}</span>
            </div>

            <div className="demo-account-list">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  className="demo-account"
                  type="button"
                  onClick={() => fillDemoCredentials(account.email)}
                >
                  <span>
                    <strong>{account.label}</strong>
                    <small>{account.description}</small>
                  </span>
                  <span className="demo-account__action">กรอกข้อมูล</span>
                </button>
              ))}
            </div>
          </div>

          <p className="login-security-note">
            Mock Authentication สำหรับการสาธิตเท่านั้น ไม่มี Bearer Token และไม่ใช่ระบบรักษาความปลอดภัย Production
          </p>
        </div>
      </section>
    </main>
  )
}
