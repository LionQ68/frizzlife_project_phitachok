export const APP_TIME_ZONE = 'Asia/Bangkok'

const numberFormatters = new Map()

function getNumberFormatter(maximumFractionDigits) {
  if (!numberFormatters.has(maximumFractionDigits)) {
    numberFormatters.set(
      maximumFractionDigits,
      new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 0,
        maximumFractionDigits,
      }),
    )
  }

  return numberFormatters.get(maximumFractionDigits)
}

function formatNumber(value, maximumFractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return 'ไม่มีข้อมูล'
  }

  return getNumberFormatter(maximumFractionDigits).format(value)
}

export function formatDateTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'ไม่มีข้อมูลเวลา'
  }

  return new Intl.DateTimeFormat('th-TH', {
    timeZone: APP_TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatFlowRate(value) {
  return `${formatNumber(value, 2)} GPM`
}

export function formatWaterUsage(value) {
  return `${formatNumber(value, 1)} ลิตร`
}

export function formatTemperature(value) {
  return `${formatNumber(value, 1)} °C`
}

export function formatPressure(value) {
  return `${formatNumber(value, 1)} PSI`
}

export function formatPercentage(value) {
  return `${formatNumber(value, 0)}%`
}

export function formatRelativeTime(value, referenceTime = Date.now()) {
  const date = new Date(value)
  const referenceDate = new Date(referenceTime)

  if (Number.isNaN(date.getTime()) || Number.isNaN(referenceDate.getTime())) {
    return 'ไม่มีข้อมูลเวลา'
  }

  const differenceInSeconds = Math.round((date.getTime() - referenceDate.getTime()) / 1000)
  const absoluteSeconds = Math.abs(differenceInSeconds)
  const formatter = new Intl.RelativeTimeFormat('th-TH', { numeric: 'auto' })

  if (absoluteSeconds < 60) {
    return formatter.format(differenceInSeconds, 'second')
  }

  if (absoluteSeconds < 3600) {
    return formatter.format(Math.round(differenceInSeconds / 60), 'minute')
  }

  if (absoluteSeconds < 86400) {
    return formatter.format(Math.round(differenceInSeconds / 3600), 'hour')
  }

  return formatter.format(Math.round(differenceInSeconds / 86400), 'day')
}
