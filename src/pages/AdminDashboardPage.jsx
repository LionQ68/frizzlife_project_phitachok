import {
  Activity,
  BellRing,
  CircleGauge,
  Database,
  Droplets,
  Gauge,
  Thermometer,
  Waves,
  Wifi,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StatCard } from '../components/StatCard.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { useAppContext } from '../context/useAppContext.js'
import {
  formatDateTime,
  formatFlowRate,
  formatPressure,
  formatRelativeTime,
  formatTemperature,
  formatWaterUsage,
} from '../utils/formatters.js'
import {
  getDailyUsageSeries,
  getDashboardKpis,
  getDeviceChartSeries,
  getLatestTelemetry,
  getModelSummaries,
  getRecentCriticalAlerts,
  getRecentValveActivity,
} from '../utils/dashboardSelectors.js'

const CHART_COLORS = {
  flow: '#0284c7',
  temperature: '#f97316',
  pressure: '#7c3aed',
  usage: '#0ea5e9',
  grid: '#e2e8f0',
  text: '#64748b',
}

const tooltipStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 12px 28px rgb(15 23 42 / 12%)',
}

function formatChartValue(value, unit) {
  return `${new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 2,
  }).format(value)} ${unit}`
}

function ChartEmptyState() {
  return (
    <div className="chart-empty-state">
      <Database size={22} aria-hidden="true" />
      <span>ยังไม่มีข้อมูลสำหรับกราฟนี้</span>
    </div>
  )
}

function getDeviceMetric(device, latestTelemetry) {
  if (!latestTelemetry) {
    return 'ไม่มีข้อมูล'
  }

  if (device.capabilities.temperature) {
    return formatTemperature(latestTelemetry.temperature)
  }

  return formatPressure(latestTelemetry.pressure)
}

export function AdminDashboardPage() {
  const {
    alerts,
    devices,
    telemetry,
    valveCommands,
  } = useAppContext()
  const preferredDevice = devices.find(
    ({ serialNumber }) => serialNumber === 'LPG365-TH-001',
  )
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    preferredDevice?.id ?? devices[0]?.id ?? '',
  )
  const selectedDevice = devices.find(({ id }) => id === selectedDeviceId)
    ?? devices[0]
    ?? null

  const dashboardKpis = useMemo(
    () => getDashboardKpis({ devices, alerts, telemetry }),
    [alerts, devices, telemetry],
  )
  const modelSummaries = useMemo(
    () => getModelSummaries(devices),
    [devices],
  )
  const chartSeries = useMemo(
    () => getDeviceChartSeries(telemetry, selectedDevice),
    [selectedDevice, telemetry],
  )
  const dailyUsageSeries = useMemo(
    () => getDailyUsageSeries(telemetry, selectedDevice?.id),
    [selectedDevice, telemetry],
  )
  const criticalAlerts = useMemo(
    () => getRecentCriticalAlerts(alerts),
    [alerts],
  )
  const recentValveActivity = useMemo(
    () => getRecentValveActivity(valveCommands),
    [valveCommands],
  )
  const deviceRows = useMemo(
    () => devices.map((device) => ({
      device,
      latestTelemetry: getLatestTelemetry(telemetry, device.id),
    })),
    [devices, telemetry],
  )
  const warningDevices = devices.filter(({ status }) => status === 'WARNING').length
  const offlineDevices = devices.filter(({ status }) => status === 'OFFLINE').length

  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <header className="dashboard-heading">
        <div>
          <div className="dashboard-eyebrow">
            <span>ภาพรวมสำหรับผู้ดูแล</span>
            <span className="dashboard-demo-label">
              <Database size={14} aria-hidden="true" />
              ข้อมูลจำลองสำหรับสาธิต
            </span>
          </div>
          <h2 id="dashboard-title">ภาพรวมระบบน้ำอัจฉริยะ</h2>
          <p>ติดตามอุปกรณ์ การใช้น้ำ และเหตุการณ์สำคัญจากข้อมูลจำลองชุดเดียวกัน</p>
        </div>

        <label className="device-selector">
          <span>ข้อมูลกราฟของอุปกรณ์</span>
          <select
            value={selectedDevice?.id ?? ''}
            onChange={(event) => setSelectedDeviceId(event.target.value)}
          >
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.serialNumber} · {device.model}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="dashboard-kpis" aria-label="ตัวชี้วัดสำคัญ">
        <StatCard
          icon={Gauge}
          label="อุปกรณ์ทั้งหมด"
          value={dashboardKpis.totalDevices}
          helper="ครอบคลุม LPG365 Series"
        />
        <StatCard
          icon={Wifi}
          label="อุปกรณ์ Online"
          value={dashboardKpis.onlineDevices}
          helper={`${warningDevices} Warning · ${offlineDevices} Offline`}
          tone="success"
        />
        <StatCard
          icon={BellRing}
          label="Active Alerts"
          value={dashboardKpis.activeAlerts}
          helper="Open และ Acknowledged"
          tone={dashboardKpis.activeAlerts > 0 ? 'critical' : 'success'}
        />
        <StatCard
          icon={Droplets}
          label="การใช้น้ำวันนี้"
          value={formatWaterUsage(dashboardKpis.todayUsage)}
          helper="ผลรวมจากอุปกรณ์ทั้งหมด"
          tone="info"
        />
      </div>

      <div className="dashboard-grid dashboard-grid--charts">
        <article className="dashboard-card dashboard-card--chart">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">FLOW RATE · 24 HOURS</span>
              <h3>อัตราการไหลย้อนหลัง</h3>
            </div>
            <span className="chart-unit">GPM</span>
          </div>
          <div
            className="chart-container"
            role="img"
            aria-label={`กราฟอัตราการไหลของ ${selectedDevice?.serialNumber ?? 'อุปกรณ์'}`}
          >
            {chartSeries.records.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries.records} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.flow} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={CHART_COLORS.flow} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke={CHART_COLORS.text} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis stroke={CHART_COLORS.text} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [formatChartValue(value, 'GPM'), 'Flow Rate']}
                    labelFormatter={(label) => `เวลา ${label} น.`}
                  />
                  <Area
                    type="monotone"
                    dataKey="flowRate"
                    stroke={CHART_COLORS.flow}
                    strokeWidth={2.5}
                    fill="url(#flowGradient)"
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : <ChartEmptyState />}
          </div>
        </article>

        <article className="dashboard-card dashboard-card--chart">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">CAPABILITY METRIC</span>
              <h3>{chartSeries.secondaryLabel || 'ข้อมูลเฉพาะรุ่น'}</h3>
            </div>
            <span className="chart-unit chart-unit--secondary">
              {chartSeries.secondaryUnit || '—'}
            </span>
          </div>
          <div
            className="chart-container"
            role="img"
            aria-label={`กราฟ${chartSeries.secondaryLabel}ของ ${selectedDevice?.serialNumber ?? 'อุปกรณ์'}`}
          >
            {chartSeries.records.length > 0 && chartSeries.secondaryKey ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartSeries.records} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="timeLabel" stroke={CHART_COLORS.text} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis stroke={CHART_COLORS.text} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      formatChartValue(value, chartSeries.secondaryUnit),
                      chartSeries.secondaryLabel,
                    ]}
                    labelFormatter={(label) => `เวลา ${label} น.`}
                  />
                  <Line
                    type="monotone"
                    dataKey={chartSeries.secondaryKey}
                    stroke={chartSeries.secondaryKey === 'temperature'
                      ? CHART_COLORS.temperature
                      : CHART_COLORS.pressure}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : <ChartEmptyState />}
          </div>
        </article>
      </div>

      <article className="dashboard-card dashboard-card--usage">
        <div className="dashboard-card__heading">
          <div>
            <span className="dashboard-card__eyebrow">DAILY WATER USAGE</span>
            <h3>ปริมาณการใช้น้ำรายวัน</h3>
          </div>
          <span className="chart-unit">ลิตร</span>
        </div>
        <div
          className="chart-container chart-container--usage"
          role="img"
          aria-label={`กราฟการใช้น้ำรายวันของ ${selectedDevice?.serialNumber ?? 'อุปกรณ์'}`}
        >
          {dailyUsageSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyUsageSeries} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="dateLabel" stroke={CHART_COLORS.text} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART_COLORS.text} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatChartValue(value, 'ลิตร'), 'Water Usage']}
                />
                <Bar
                  dataKey="usage"
                  fill={CHART_COLORS.usage}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={64}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : <ChartEmptyState />}
        </div>
      </article>

      <div className="dashboard-grid dashboard-grid--status">
        <article className="dashboard-card model-summary-card">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">MODEL SUMMARY</span>
              <h3>สรุปตามรุ่น</h3>
            </div>
          </div>
          <div className="model-summary-list">
            {modelSummaries.map((summary) => {
              const isTemperatureModel = summary.model === 'LPG365'
              const MetricIcon = isTemperatureModel ? Thermometer : CircleGauge

              return (
                <div className="model-summary-item" key={summary.model}>
                  <div className={`model-summary-item__icon${isTemperatureModel ? ' model-summary-item__icon--temperature' : ''}`}>
                    <MetricIcon size={21} aria-hidden="true" />
                  </div>
                  <div className="model-summary-item__copy">
                    <strong>{summary.model}</strong>
                    <span>{isTemperatureModel ? 'Flow · Usage · Temperature' : 'Flow · Usage · Pressure'}</span>
                  </div>
                  <div className="model-summary-item__count">
                    <strong>{summary.total}</strong>
                    <span>{summary.online} Online</span>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="dashboard-card device-status-card">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">DEVICE STATUS</span>
              <h3>สถานะอุปกรณ์</h3>
            </div>
            <Link className="dashboard-text-link" to="/admin/devices">ดูอุปกรณ์ทั้งหมด</Link>
          </div>
          <div className="dashboard-table-scroll">
            <table className="device-status-table">
              <thead>
                <tr>
                  <th>อุปกรณ์</th>
                  <th>การเชื่อมต่อ</th>
                  <th>Valve</th>
                  <th>Flow</th>
                  <th>ค่าตามรุ่น</th>
                </tr>
              </thead>
              <tbody>
                {deviceRows.map(({ device, latestTelemetry }) => (
                  <tr key={device.id}>
                    <td>
                      <Link to={`/admin/devices/${device.id}`}>
                        <strong>{device.serialNumber}</strong>
                        <span>{device.model} · {device.location}</span>
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={device.status} />
                      <small>{formatRelativeTime(device.lastSeenAt)}</small>
                    </td>
                    <td><StatusBadge status={device.valveStatus} /></td>
                    <td>{latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ไม่มีข้อมูล'}</td>
                    <td>{getDeviceMetric(device, latestTelemetry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dashboard-device-mobile-list">
            {deviceRows.map(({ device, latestTelemetry }) => (
              <Link
                className="dashboard-device-card"
                key={device.id}
                to={`/admin/devices/${device.id}`}
              >
                <div className="dashboard-device-card__heading">
                  <div>
                    <strong>{device.serialNumber}</strong>
                    <span>{device.model} · {device.location}</span>
                  </div>
                  <StatusBadge status={device.status} />
                </div>
                <dl>
                  <div><dt>Valve</dt><dd><StatusBadge status={device.valveStatus} /></dd></div>
                  <div><dt>Flow Rate</dt><dd>{latestTelemetry ? formatFlowRate(latestTelemetry.flowRate) : 'ไม่มีข้อมูล'}</dd></div>
                  <div><dt>ค่าตามรุ่น</dt><dd>{getDeviceMetric(device, latestTelemetry)}</dd></div>
                  <div><dt>ติดต่อล่าสุด</dt><dd>{formatRelativeTime(device.lastSeenAt)}</dd></div>
                </dl>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <div className="dashboard-grid dashboard-grid--activity">
        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">CRITICAL INCIDENTS</span>
              <h3>Critical Alerts ล่าสุด</h3>
            </div>
            <Link className="dashboard-text-link" to="/admin/alerts">ดู Alerts ทั้งหมด</Link>
          </div>
          {criticalAlerts.length > 0 ? (
            <div className="activity-list">
              {criticalAlerts.map((alert) => {
                const device = devices.find(({ id }) => id === alert.deviceId)

                return (
                  <Link
                    className="activity-item"
                    key={alert.id}
                    to={`/admin/alerts?alert=${alert.id}`}
                  >
                    <span className="activity-item__icon activity-item__icon--critical">
                      <BellRing size={18} aria-hidden="true" />
                    </span>
                    <span className="activity-item__copy">
                      <strong>{alert.title}</strong>
                      <span>{device?.serialNumber ?? 'ไม่พบอุปกรณ์'} · {formatDateTime(alert.createdAt)}</span>
                    </span>
                    <StatusBadge status={alert.status} />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">ไม่มี Critical Alert ในข้อมูลจำลอง</div>
          )}
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__heading">
            <div>
              <span className="dashboard-card__eyebrow">VALVE ACTIVITY</span>
              <h3>คำสั่งวาล์วล่าสุด</h3>
            </div>
            <Link className="dashboard-text-link" to="/admin/devices">ดูอุปกรณ์</Link>
          </div>
          {recentValveActivity.length > 0 ? (
            <div className="activity-list">
              {recentValveActivity.map((command) => {
                const device = devices.find(({ id }) => id === command.deviceId)
                const isCloseCommand = command.command === 'CLOSE'

                return (
                  <Link
                    className="activity-item"
                    key={command.id}
                    to={`/admin/devices/${command.deviceId}`}
                  >
                    <span className={`activity-item__icon${isCloseCommand ? ' activity-item__icon--warning' : ''}`}>
                      {isCloseCommand
                        ? <Waves size={18} aria-hidden="true" />
                        : <Activity size={18} aria-hidden="true" />}
                    </span>
                    <span className="activity-item__copy">
                      <strong>{isCloseCommand ? 'ปิดวาล์ว' : 'เปิดวาล์ว'} · {device?.serialNumber ?? 'ไม่พบอุปกรณ์'}</strong>
                      <span>{command.source === 'AUTOMATION' ? 'ระบบอัตโนมัติ' : 'ผู้ใช้งาน'} · {formatDateTime(command.createdAt)}</span>
                    </span>
                    <StatusBadge status={command.status} />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">ยังไม่มีประวัติคำสั่งวาล์ว</div>
          )}
        </article>
      </div>
    </section>
  )
}
