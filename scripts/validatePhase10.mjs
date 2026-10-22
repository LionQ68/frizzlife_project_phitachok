import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

const app = read('src/App.jsx')
const appShell = read('src/components/AppShell.jsx')
const header = read('src/components/Header.jsx')
const sidebar = read('src/components/Sidebar.jsx')
const accessibilityCss = read('src/styles/accessibility.css')
const dashboardCss = read('src/styles/dashboard.css')
const dashboardPage = read('src/pages/AdminDashboardPage.jsx')
const main = read('src/main.jsx')

assert.match(app, /lazyPage/)
assert.match(app, /Suspense/)
assert.match(app, /AppErrorBoundary/)
assert.match(app, /type="loading"/)
assert.match(appShell, /className="skip-link"/)
assert.match(appShell, /id="main-content"/)
assert.match(header, /aria-expanded=\{isNavigationOpen\}/)
assert.match(sidebar, /useFocusTrap/)
assert.match(sidebar, /aria-hidden=/)
assert.match(sidebar, /inert=/)
assert.match(accessibilityCss, /prefers-reduced-motion/)
assert.match(accessibilityCss, /\.skip-link:focus/)
assert.match(dashboardPage, /dashboard-device-mobile-list/)
assert.match(dashboardCss, /@media \(max-width: 780px\)/)
assert.match(dashboardCss, /\.dashboard-table-scroll\s*\{\s*display: none;/s)
assert.match(main, /styles\/accessibility\.css/)

const modalFiles = [
  'src/components/ConfirmModal.jsx',
  'src/components/DeviceFormModal.jsx',
  'src/components/ResetSimulationModal.jsx',
  'src/components/ResolveAlertModal.jsx',
  'src/components/SensorEditModal.jsx',
]

for (const modalFile of modalFiles) {
  const source = read(modalFile)
  assert.match(source, /useFocusTrap/)
  assert.match(source, /ref=\{modalRef\}/)
  assert.match(source, /aria-modal="true"/)
  assert.match(source, /aria-labelledby=/)
}

const sourceFilesWithoutMockData = [
  app,
  appShell,
  header,
  sidebar,
  dashboardPage,
  ...modalFiles.map(read),
]
assert.equal(
  sourceFilesWithoutMockData.some((source) => /20\d{2}[-/]\d{1,2}[-/]\d{1,2}/.test(source)),
  false,
)

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    routeLazyLoading: true,
    suspenseLoadingState: true,
    globalErrorBoundary: true,
    skipLinkAndMainTarget: true,
    mobileDrawerSemantics: true,
    modalFocusTrap: true,
    responsiveDeviceCards: true,
    reducedMotion: true,
    noHardCodedOldDates: true,
  },
}, null, 2))
