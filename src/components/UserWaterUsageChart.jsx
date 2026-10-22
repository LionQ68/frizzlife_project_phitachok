import { BarChart3 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const tooltipStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 12px 30px rgb(15 23 42 / 12%)',
  fontSize: '12px',
}

function formatUsage(value) {
  return `${new Intl.NumberFormat('th-TH', { maximumFractionDigits: 1 }).format(value)} ลิตร`
}

export function UserWaterUsageChart({ series }) {
  return (
    <section className="user-usage-card" aria-labelledby="user-usage-title">
      <div className="device-detail-panel__heading">
        <div>
          <span className="devices-eyebrow">WATER USAGE</span>
          <h3 id="user-usage-title">ปริมาณการใช้น้ำรายวัน</h3>
        </div>
        <BarChart3 size={20} aria-hidden="true" />
      </div>

      <div className="user-usage-chart" role="img" aria-label="กราฟปริมาณการใช้น้ำจำลองรายวัน หน่วยลิตร">
        {series.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="dateLabel" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatUsage(value), 'Water Usage']} />
              <Bar dataKey="usage" fill="#0ea5e9" radius={[7, 7, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="detail-chart-empty">ยังไม่มีข้อมูลการใช้น้ำ</div>
        )}
      </div>
      <p className="history-record-count">ข้อมูลจำลองสำหรับสาธิต · ไม่มีการเชื่อมต่ออุปกรณ์จริง</p>
    </section>
  )
}
