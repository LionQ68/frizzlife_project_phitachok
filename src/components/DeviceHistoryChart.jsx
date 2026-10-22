import { Activity, CircleGauge, Thermometer } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  DEVICE_HISTORY_RANGES,
  getDeviceHistorySeries,
} from '../utils/deviceDetailSelectors.js'

const CHART_COLORS = Object.freeze({
  flow: '#0284c7',
  temperature: '#d97706',
  pressure: '#7c3aed',
  grid: '#e2e8f0',
  text: '#64748b',
})

const tooltipStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 12px 30px rgb(15 23 42 / 12%)',
  fontSize: '12px',
}

function formatValue(value, unit) {
  if (!Number.isFinite(value)) {
    return 'ไม่มีข้อมูล'
  }

  return `${new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2 }).format(value)} ${unit}`
}

function ChartEmptyState() {
  return (
    <div className="detail-chart-empty">
      ยังไม่มี Telemetry สำหรับอุปกรณ์นี้
    </div>
  )
}

export function DeviceHistoryChart({ device, telemetry }) {
  const [range, setRange] = useState('24H')
  const series = useMemo(
    () => getDeviceHistorySeries(telemetry, device, range),
    [device, range, telemetry],
  )
  const SpecificIcon = series.secondaryKey === 'temperature' ? Thermometer : CircleGauge
  const specificColor = series.secondaryKey === 'temperature'
    ? CHART_COLORS.temperature
    : CHART_COLORS.pressure

  return (
    <section className="device-history-section" aria-labelledby="device-history-title">
      <div className="device-section-heading">
        <div>
          <span className="devices-eyebrow">HISTORICAL TELEMETRY</span>
          <h3 id="device-history-title">ข้อมูลย้อนหลัง</h3>
          <p>แสดงข้อมูลจำลองรายชั่วโมง โดยลดจำนวนจุดเฉพาะตอนวาดกราฟเพื่อให้อ่านง่าย</p>
        </div>
        <div className="history-range-tabs" aria-label="เลือกช่วงข้อมูลย้อนหลัง">
          {Object.entries(DEVICE_HISTORY_RANGES).map(([value, config]) => (
            <button
              className={range === value ? 'history-range-tab history-range-tab--active' : 'history-range-tab'}
              key={value}
              type="button"
              aria-pressed={range === value}
              onClick={() => setRange(value)}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="detail-chart-grid">
        <article className="detail-chart-card">
          <div className="detail-chart-card__heading">
            <div><Activity size={18} aria-hidden="true" /><h4>Flow Rate</h4></div>
            <span>GPM</span>
          </div>
          <div className="detail-chart" role="img" aria-label={`กราฟ Flow Rate ย้อนหลัง ${DEVICE_HISTORY_RANGES[range].label}`}>
            {series.records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series.records} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="detailFlowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.flow} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={CHART_COLORS.flow} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="chartLabel" stroke={CHART_COLORS.text} tickLine={false} axisLine={false} minTickGap={28} />
                  <YAxis stroke={CHART_COLORS.text} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatValue(value, 'GPM'), 'Flow Rate']} />
                  <Area type="monotone" dataKey="flowRate" stroke={CHART_COLORS.flow} strokeWidth={2.5} fill="url(#detailFlowGradient)" dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <ChartEmptyState />}
          </div>
        </article>

        <article className="detail-chart-card">
          <div className="detail-chart-card__heading">
            <div><SpecificIcon size={18} aria-hidden="true" /><h4>{series.secondaryLabel}</h4></div>
            <span>{series.secondaryUnit}</span>
          </div>
          <div className="detail-chart" role="img" aria-label={`กราฟ ${series.secondaryLabel} ย้อนหลัง ${DEVICE_HISTORY_RANGES[range].label}`}>
            {series.records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series.records} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="chartLabel" stroke={CHART_COLORS.text} tickLine={false} axisLine={false} minTickGap={28} />
                  <YAxis stroke={CHART_COLORS.text} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatValue(value, series.secondaryUnit), series.secondaryLabel]} />
                  <Line type="monotone" dataKey={series.secondaryKey} stroke={specificColor} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <ChartEmptyState />}
          </div>
        </article>
      </div>
      <p className="history-record-count">ข้อมูลต้นทางในช่วงนี้ {series.sourceRecordCount} จุด · ข้อมูลจำลองสำหรับสาธิต</p>
    </section>
  )
}
