# Development Phases — Frizzlife Smart Water Dashboard

เอกสารนี้แบ่งการพัฒนาออกเป็น Phase ขนาดเล็ก โดยอ้างอิงขอบเขตและเกณฑ์ตรวจรับจาก `PROJECT_PLAN.md` และกติกาการทำงานจาก `AGENTS.md`

## กติกาการทำงานระหว่าง Phase

1. ทำทีละ Phase ตามลำดับ เพราะแต่ละ Phase ใช้ผลลัพธ์จาก Phase ก่อนหน้า
2. อ่าน `AGENTS.md`, `PROJECT_PLAN.md` และ Phase ปัจจุบันก่อนแก้โค้ด
3. ก่อนเริ่มทุก Phase ให้ตรวจโปรเจกต์แบบ Read-only และนำเสนอแผนของ Phase นั้นแก่ผู้ใช้
4. แผนต้องระบุ Objective, Scope, Expected Files, Data Decisions, Acceptance Criteria, Verification และ Non-goals
5. หากข้อมูลไม่ครบ คลุมเครือ หรือขัดแย้ง ต้องถามผู้ใช้ ห้ามตั้งสมมติฐานและลงมือเอง
6. ห้ามแก้ Application Code หรือติดตั้ง Dependency จนกว่าผู้ใช้จะอนุมัติแผนของ Phase นั้นอย่างชัดเจน
7. การอนุมัติครอบคลุมเฉพาะ Phase ที่นำเสนอ เมื่อขึ้น Phase ใหม่ต้องขออนุมัติใหม่
8. หาก Scope ที่อนุมัติแล้วจำเป็นต้องเปลี่ยนอย่างมีนัยสำคัญ ให้หยุด อธิบาย และขออนุมัติใหม่
9. ไม่เริ่ม Phase ถัดไปจนกว่า Acceptance Criteria ของ Phase ปัจจุบันจะผ่าน
10. หลังการเปลี่ยนแปลงสำคัญให้รัน `npm run lint` และ `npm run build`
11. หากมีปัญหาที่ไม่เกี่ยวกับ Phase ปัจจุบัน ให้บันทึกไว้ก่อนและไม่ขยายขอบเขตเอง
12. P0 ต้องเสร็จก่อน P1 และไม่ทำ P2 จนกว่าผู้ใช้จะสั่ง
13. ทุก Phase ต้องรักษากฎความแตกต่างของรุ่น:
   - LPG365: Flow + Usage + Temperature
   - LPG365-P: Flow + Usage + Pressure

## Approval Gate Template

ก่อนเริ่มแต่ละ Phase ต้องนำเสนอหัวข้อต่อไปนี้และรอคำว่าอนุมัติจากผู้ใช้:

```text
Phase:
Objective:
Current state:
In scope:
Expected files:
Data or UX decisions requiring approval:
Acceptance criteria:
Verification:
Non-goals:
Open questions:
Approval status: Waiting for user approval
```

## ภาพรวม Flow

```text
Phase 0  Project Foundation
   ↓
Phase 1  Mock Data + Capability Rules
   ↓
Phase 2  Shared State + Services
   ↓
Phase 3  App Shell + Routing + Authentication
   ↓
Phase 4  Admin Overview Dashboard
   ↓
Phase 5  Device Management
   ↓
Phase 6  Device Detail + Safe Valve Control
   ↓
Phase 7  Alerts and Incidents
   ↓
Phase 8  Device Simulator + Cross-page Updates
   ↓
Phase 9  User Dashboard + Role Isolation
   ↓
Phase 10 Responsive + Accessibility + UI States
   ↓
Phase 10.5 User Management + Device Assignment
   ↓
Phase 10.6 App-wide Telemetry Runtime
   ↓
Phase 10.7 Admin-only Leak Recovery Simulation
   ↓
Phase 11 End-to-end QA + README + Demo Handoff
```

---

## Phase 0 — Project Foundation

**สถานะ:** Complete  
**Priority:** P0  
**เป้าหมาย:** เปลี่ยนโปรเจกต์เริ่มต้นของ Vite ให้เป็นโครงสร้างพร้อมพัฒนา Dashboard

### งานที่ต้องทำ

- ยืนยันว่าโปรเจกต์ใช้ React + Vite + JavaScript เท่านั้น
- ติดตั้ง React Router, Recharts และ Lucide React
- ลบหน้า ตัวอย่าง Counter และ Asset เริ่มต้นเมื่อมีหน้า App Shell แทนแล้ว
- สร้างโฟลเดอร์ `components`, `pages`, `data`, `services`, `context`, `hooks` และ `styles`
- สร้าง Design Tokens สำหรับสี ตัวอักษร ระยะห่าง Radius และ Shadow
- สร้าง CSS Reset และ Base Styles
- กำหนด Breakpoints สำหรับ Desktop, Tablet และ Mobile

### ไฟล์หลักที่คาดว่าจะเกี่ยวข้อง

- `package.json`
- `src/App.jsx`
- `src/main.jsx`
- `src/styles/global.css`
- `src/styles/tokens.css`

### Acceptance Criteria

- ไม่มีไฟล์หรือ Config ของ TypeScript
- หน้าเริ่มต้นเปิดได้โดยไม่มี Runtime Error
- โครงสร้างโฟลเดอร์พร้อมสำหรับ Phase ถัดไป
- Theme พื้นฐานใช้สีตามแผนและภาษาไทยแสดงผลได้
- `npm run lint` ผ่าน
- `npm run build` ผ่าน

### ผลการตรวจจริง — 22 ตุลาคม 2026

- ติดตั้ง `react-router-dom`, `recharts` และ `lucide-react` สำเร็จ
- สร้างโครงสร้างโฟลเดอร์และไฟล์ Theme Foundation ครบ
- เปลี่ยนหน้า Vite Counter เป็น Foundation Screen ภาษาไทย
- ลบ Starter Assets และ CSS เดิมที่ไม่ใช้งานแล้ว
- ไม่พบไฟล์ TypeScript หรือ `tsconfig`
- `npm run lint` ผ่าน (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)
- Development Server ตอบกลับ HTTP 200 และพบ Root Element ของ React

---

## Phase 1 — Mock Data and Device Capability Rules

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 0  
**เป้าหมาย:** สร้างข้อมูลจำลองที่เป็นแหล่งข้อมูลกลางและรองรับทั้งสองรุ่นอย่างถูกต้อง

### งานที่ต้องทำ

- สร้างผู้ใช้ตัวอย่างอย่างน้อยหนึ่ง Admin และแยก User Demo ตามรุ่นอุปกรณ์:
  - `user_365@frizzlife.demo` สำหรับผู้ใช้ LPG365
  - `user_365p@frizzlife.demo` สำหรับผู้ใช้ LPG365-P
- สร้างอุปกรณ์ตัวอย่างอย่างน้อย 3 เครื่อง:
  - LPG365-P อย่างน้อย 1 เครื่อง
  - LPG365 อย่างน้อย 1 เครื่อง
- เพิ่ม `model`, `packageVariant` และ `capabilities` ในข้อมูลอุปกรณ์
- สร้าง Leak Sensor 3 ตัวต่ออุปกรณ์
- สร้าง Telemetry, Alerts และ Valve Command History ตัวอย่าง
- สร้าง Helper กลาง เช่น `getDeviceCapabilities(device)`
- สร้าง Formatter สำหรับวันที่ Asia/Bangkok และหน่วย GPM, PSI, °C และ Gallon
- ห้ามใช้วันที่เก่าที่ Hard-code เพื่อแสดงว่าเป็นเวลาปัจจุบัน

### ไฟล์หลักที่คาดว่าจะเกี่ยวข้อง

- `src/data/users.js`
- `src/data/devices.js`
- `src/data/leakSensors.js`
- `src/data/telemetry.js`
- `src/data/alerts.js`
- `src/data/valveCommands.js`
- `src/data/index.js`
- `src/utils/deviceCapabilities.js`
- `src/utils/formatters.js`

### Acceptance Criteria

- User Demo แต่ละบัญชีเห็นเฉพาะอุปกรณ์รุ่นที่ผูกกับบัญชีนั้น
- LPG365 มี Temperature และไม่มี Pressure
- LPG365-P มี Pressure และไม่มี Temperature
- ทุกอุปกรณ์มี Leak Sensor 3 ตัว
- ข้อมูลสัมพันธ์กันด้วย `deviceId` และ `sensorId`
- ไม่มีคำกล่าวอ้างว่าเชื่อมต่อ Cloud หรืออุปกรณ์จริง
- Lint และ Build ผ่าน

### ผลการตรวจจริง — 22 ตุลาคม 2026

- สร้างบัญชี Demo 3 บัญชี ได้แก่ Admin, User สำหรับ LPG365 และ User สำหรับ LPG365-P
- สร้างอุปกรณ์จำลอง 3 เครื่อง โดย User LPG365 เห็น 1 เครื่อง และ User LPG365-P เห็น 2 เครื่องตาม `assignedDeviceIds`
- สร้าง Leak Sensor ครบ 3 ตัวต่ออุปกรณ์ รวม 9 ตัว
- สร้าง Telemetry แบบ Dynamic รวม 72 Records โดยคำนวณเวลาจากเวลาที่โหลดข้อมูล
- LPG365 มี `temperature` และไม่มี `pressure` ใน Telemetry
- LPG365-P มี `pressure` และไม่มี `temperature` ใน Telemetry
- สร้าง Alert ตัวอย่าง 4 รายการ ครบระดับ Info, Warning และ Critical
- สร้าง Valve Command History ตัวอย่าง 4 รายการ
- สร้าง Capability Helper และ Formatter สำหรับเวลา Asia/Bangkok และหน่วยของระบบ
- ตรวจความสัมพันธ์ของ User, Device, Sensor, Telemetry, Alert และ Valve Command ผ่าน
- `npm run lint` ผ่าน (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)

---

## Phase 2 — Shared State, Services and Persistence

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 1  
**เป้าหมาย:** ทำให้ทุกหน้าอ่านและแก้ไขข้อมูลจำลองชุดเดียวกัน

### งานที่ต้องทำ

- สร้าง App Context หรือ State Provider กลาง
- สร้าง Service สำหรับ Authentication, Device, Alert, Valve และ Simulator
- สร้างฟังก์ชันอ่าน/เขียน `localStorage`
- รองรับ Reset Demo Data กลับค่าเริ่มต้น
- กำหนด Action สำคัญ:
  - Login และ Logout
  - Add/Edit Device
  - Acknowledge/Resolve Alert
  - Open/Close Valve
  - Simulate/Reset Event
- รวมกฎความปลอดภัยของวาล์วไว้ใน Service ไม่กระจายอยู่ใน UI

### ไฟล์หลักที่คาดว่าจะเกี่ยวข้อง

- `src/context/AppContext.js`
- `src/context/AppContext.jsx`
- `src/context/useAppContext.js`
- `src/services/authService.js`
- `src/services/deviceService.js`
- `src/services/alertService.js`
- `src/services/valveService.js`
- `src/services/simulatorService.js`
- `src/services/storageService.js`
- `src/services/index.js`
- `scripts/validatePhase2.mjs`
- `src/main.jsx`

### Acceptance Criteria

- ข้อมูลที่แก้จาก Service สะท้อนในทุก Component ที่ใช้ข้อมูลเดียวกัน
- Refresh แล้วข้อมูล Demo ที่จำเป็นยังคงอยู่
- Reset แล้วข้อมูลกลับเป็นค่าเริ่มต้น
- ไม่สามารถเปิดวาล์วได้เมื่อมี Active Critical Leak
- Lint และ Build ผ่าน

### ผลการตรวจจริง — 22 ตุลาคม 2026

- สร้าง `AppProvider` และเชื่อมเข้ากับ React Application สำเร็จ
- สร้าง Shared State สำหรับ User, Device, Sensor, Telemetry, Alert, Valve Command และ Event Log
- แยก `localStorage` เป็น Demo State และ Session ด้วย Key ที่มี Version
- Login รองรับ Email แบบไม่แยกตัวพิมพ์ใหญ่–เล็ก และ Session ไม่มี Password
- Admin เห็นอุปกรณ์ 3 เครื่อง, User LPG365 เห็น 1 เครื่อง และ User LPG365-P เห็น 2 เครื่อง
- Add Device สร้าง Capability ตามรุ่นและ Leak Sensor 3 ตัวโดยอัตโนมัติ
- เปลี่ยนรุ่นอุปกรณ์แล้ว Telemetry ถูกปรับให้ไม่มี Metric ที่รุ่นไม่รองรับ
- Alert บังคับลำดับ `OPEN → ACKNOWLEDGED → RESOLVED`
- Simulate Leak สร้าง Critical Alert, เปลี่ยน Sensor เป็น `LEAK`, ปิดวาล์ว และบันทึก Event/Valve Command
- Active Critical Alert ป้องกันคำสั่งเปิดวาล์วและบันทึกคำสั่งที่ล้มเหลว
- Resolve Alert ไม่เปิดวาล์วอัตโนมัติ
- Simulator จำกัด Temperature เฉพาะ LPG365 และ Pressure เฉพาะ LPG365-P
- จำกัด Telemetry ไม่เกิน 120 Records ต่ออุปกรณ์
- Reset Demo Data คืนข้อมูลเริ่มต้นและยังคง Session ปัจจุบัน
- `npm run validate:phase2` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)
- Development Server ตอบกลับ HTTP 200 และพบ React Root

---

## Phase 3 — App Shell, Routing and Mock Authentication

**สถานะ:** Complete  
**Priority:** P1 แต่ต้องทำก่อนหน้าที่แยก Role  
**ขึ้นต่อ:** Phase 2  
**เป้าหมาย:** สร้างโครง Navigation และแยกสิทธิ์ Admin/User

### งานที่ต้องทำ

- สร้าง Login Page แบบฟอร์มเดียว ไม่มีตัวเลือก Role
- เพิ่ม Demo Login สำหรับ Admin และ User ในส่วน `Demo Only`
- สร้าง App Shell, Sidebar, Header และ Mobile Drawer
- ตั้งค่า Routes ของ Admin และ User
- สร้าง Protected Route และ Role Guard
- Login แล้ว Redirect ตาม Role อัตโนมัติ
- เพิ่ม Logout และจัดเก็บ Session จำลองใน `localStorage`
- เพิ่มหน้า Not Found และ Unauthorized แบบง่าย

### Acceptance Criteria

- Admin Login ไปหน้า Admin Overview
- User Login ไปหน้า User Dashboard
- User เปิด Admin Route โดยตรงไม่ได้
- Logout แล้วกลับหน้า Login
- ไม่มีปุ่มให้ผู้ใช้เลือกว่าเป็น Admin หรือ User ในฟอร์มจริง
- แสดงข้อความชัดเจนว่าเป็น Mock Authentication
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/App.jsx`
- `src/main.jsx`
- `src/components/AppShell.jsx`
- `src/components/Header.jsx`
- `src/components/Sidebar.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/RoleRoute.jsx`
- `src/components/PagePlaceholder.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/AdminDashboardPage.jsx`
- `src/pages/UserDashboardPage.jsx`
- `src/pages/DevicesPage.jsx`
- `src/pages/AlertsPage.jsx`
- `src/pages/SimulatorPage.jsx`
- `src/pages/UnauthorizedPage.jsx`
- `src/pages/NotFoundPage.jsx`
- `src/utils/navigation.js`
- `src/styles/auth.css`
- `src/styles/shell.css`
- `src/styles/pages.css`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- สร้าง Login Page แบบฟอร์มเดียว ไม่มีตัวเลือก Role ในขั้นตอนเข้าสู่ระบบ
- ปุ่มบัญชีในส่วน `Demo Only` ทำหน้าที่กรอก Email และ Password เท่านั้น ผู้ใช้ยังต้องกดปุ่มเข้าสู่ระบบหลัก
- Login แล้ว Redirect ตาม Role อัตโนมัติ: Admin ไป `/admin/dashboard` และ User ไป `/user/dashboard`
- สร้าง Protected Route และ Role Guard; ผู้ใช้ที่ยังไม่ Login ถูกส่งกลับ `/login`
- User เปิดเส้นทาง Admin โดยตรงไม่ได้ และ Admin เปิดเส้นทาง User โดยตรงไม่ได้ โดยระบบส่งไป `/unauthorized`
- สร้าง Admin Navigation สำหรับ Overview, Devices, Alerts และ Simulator ส่วน User เห็นเฉพาะ Dashboard ของตนเอง
- สร้าง App Shell, Sidebar, Header, Mobile Drawer และรองรับการปิด Drawer หลังเลือกเมนู
- Logout ล้าง Session และกลับหน้า Login; Refresh แล้วยังคง Session จำลองเดิม
- Session เก็บเฉพาะ `userId`, `role` และเวลาเริ่ม Session ไม่มี Password หรือ Bearer Token
- เพิ่มหน้า Unauthorized และ Not Found พร้อมทางกลับไปหน้าที่เหมาะสม
- ตรวจเส้นทาง Login, Admin, User, Unauthorized, Not Found, Root Redirect, Logout และ Session Refresh ผ่านใน Browser
- ตรวจหน้าจอ Desktop, Tablet และ Narrow/Mobile Layout; Mobile Drawer ใช้งานได้และไม่พบ Browser Console Warning/Error
- `npm run validate:phase2` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)

---

## Phase 4 — Admin Overview Dashboard

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 3  
**เป้าหมาย:** แสดงสถานะสำคัญของระบบให้เข้าใจได้ภายในไม่กี่วินาที

### งานที่ต้องทำ

- สร้าง KPI Cards: Total, Online, Active Alerts และ Today Usage
- สร้าง Model Summary สำหรับ LPG365 และ LPG365-P
- สร้าง Device Selector หรือ Model Filter
- สร้าง Flow Chart
- สร้างกราฟรองตาม Capability:
  - Temperature สำหรับ LPG365
  - Pressure สำหรับ LPG365-P
- สร้าง Daily Water Usage Chart
- แสดง Device Status, Recent Critical Alerts และ Recent Valve Activity
- เพิ่มป้าย `ข้อมูลจำลองสำหรับสาธิต`

### Acceptance Criteria

- KPI คำนวณจาก Mock State ไม่ใช่ตัวเลข Hard-code ใน Component
- เลือก LPG365 แล้วไม่เห็น Pressure
- เลือก LPG365-P แล้วไม่เห็น Temperature
- กราฟแสดงหน่วยถูกต้อง
- รายการล่าสุดเชื่อมโยงไปหน้าที่เกี่ยวข้องได้
- Desktop Layout ใช้งานได้โดยไม่ล้นแนวนอน
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/AdminDashboardPage.jsx`
- `src/components/StatCard.jsx`
- `src/components/StatusBadge.jsx`
- `src/utils/dashboardSelectors.js`
- `src/styles/dashboard.css`
- `src/data/telemetry.js`
- `src/main.jsx`
- `scripts/validatePhase4.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เปลี่ยนหน้า Admin Overview จาก Placeholder เป็น Dashboard ที่อ่านข้อมูลจาก Shared State
- KPI คำนวณจำนวนอุปกรณ์ทั้งหมด, Online, Active Alerts และการใช้น้ำวันนี้จากข้อมูลจริงใน Context โดยไม่ Hard-code ตัวเลขใน Component
- Active Alerts นับสถานะ `OPEN` และ `ACKNOWLEDGED` โดยไม่นับ `RESOLVED`
- เพิ่ม Device Selector โดยเลือก `LPG365-TH-001` รุ่น LPG365-P เป็นค่าเริ่มต้น
- Flow Chart แสดงข้อมูลย้อนหลัง 24 จุดและใช้หน่วย GPM
- LPG365 แสดงกราฟ Temperature หน่วย °C และไม่มีข้อมูล Pressure ใน Series
- LPG365-P แสดงกราฟ Pressure หน่วย PSI และไม่มีข้อมูล Temperature ใน Series
- ขยายข้อมูล Telemetry เริ่มต้นเป็น 120 จุดต่ออุปกรณ์ เพื่อรองรับกราฟ Daily Water Usage หลายวันโดยยังอยู่ในขีดจำกัดของ Simulator
- Daily Water Usage คำนวณจากผลต่างของค่า Usage สะสมและจัดกลุ่มวันตามเขตเวลา Asia/Bangkok
- เพิ่ม Model Summary, Device Status, Critical Alerts ล่าสุด และ Valve Activity ล่าสุด
- รายการ Alert เชื่อมไป `/admin/alerts` และรายการ Device/Valve เชื่อมไป `/admin/devices`
- แสดง Model, Connection, Valve, Flow และ Metric เฉพาะรุ่นของอุปกรณ์แต่ละเครื่อง
- ตรวจ Responsive Layout บน Desktop, Tablet และ Narrow/Mobile โดยข้อมูลตารางเลื่อนภายใน Card และไม่ทำให้ Layout หลักล้นแนวนอน
- ตรวจการสลับ LPG365/LPG365-P, Navigation Link และ User Role Guard ผ่านใน Browser
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2` ผ่านทุก Scenario เดิม (exit code 0)
- `npm run validate:phase4` ผ่านทุก Scenario ของ Dashboard (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 5 — Device Management

**สถานะ:** Complete  
**Priority:** P0/P1  
**ขึ้นต่อ:** Phase 4  
**เป้าหมาย:** ให้ Admin ค้นหา กรอง เพิ่ม แก้ไข และเปิดดูอุปกรณ์ได้

### งานที่ต้องทำ

- สร้าง Device Table สำหรับ Desktop และ Device Card สำหรับ Mobile
- เพิ่ม Search ตาม Device ID, ลูกค้า และสถานที่
- เพิ่ม Status Filter และ Model Filter
- แสดง Model Badge, Connection Status, Valve Status และค่าล่าสุด
- สร้าง Add/Edit Device Form
- Model ที่เลือกต้องสร้าง `capabilities` ถูกต้องโดยอัตโนมัติ
- เพิ่ม Assigned User และ Installation Location
- เพิ่ม Empty State เมื่อไม่พบข้อมูล

### Acceptance Criteria

- Search และ Filter สามารถใช้ร่วมกันได้
- LPG365 แสดง Flow + Temperature ในค่าล่าสุด
- LPG365-P แสดง Flow + Pressure ในค่าล่าสุด
- เพิ่มและแก้ไขข้อมูลแล้ว State กลางอัปเดต
- เปิด Device Detail ของอุปกรณ์ที่เลือกได้
- เฉพาะ Admin ที่เข้าถึง Add/Edit ได้
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/DevicesPage.jsx`
- `src/pages/DeviceDetailPage.jsx`
- `src/components/DeviceCard.jsx`
- `src/components/DeviceFormModal.jsx`
- `src/services/deviceService.js`
- `src/utils/deviceFilters.js`
- `src/styles/devices.css`
- `src/App.jsx`
- `src/components/AppShell.jsx`
- `src/pages/AdminDashboardPage.jsx`
- `src/main.jsx`
- `scripts/validatePhase5.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เปลี่ยนหน้า Device Management จาก Placeholder เป็นรายการอุปกรณ์ที่อ่านข้อมูลจาก Shared State
- Desktop แสดง Device Table และ Mobile แสดง Device Card พร้อม Model, Connection, Valve, Assigned User, Last Seen และค่าล่าสุด
- Search ครอบคลุม Serial Number, ชื่ออุปกรณ์, ลูกค้า และสถานที่ และใช้ร่วมกับ Status/Model Filter ได้
- เพิ่ม Result Count, ปุ่มล้างตัวกรอง และ Empty State เมื่อไม่พบข้อมูล
- LPG365 แสดง Flow, Usage และ Temperature ส่วน LPG365-P แสดง Flow, Usage และ Pressure โดยไม่สร้างค่าที่รุ่นไม่รองรับ
- เพิ่ม Add/Edit Device Modal พร้อมตรวจ Required Field, Model, Status, Assigned User และ Serial Number ซ้ำแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
- อุปกรณ์ใหม่ใช้ค่าเริ่มต้น LPG365-P, Online, Valve Closed และ Protection Enabled พร้อมสร้าง Leak Sensor จำลอง 3 จุดโดยอัตโนมัติ
- อุปกรณ์ใหม่ไม่มี Telemetry ปลอมและแสดง `ยังไม่มีข้อมูล` จนกว่าจะมีข้อมูลจริงจากระบบจำลอง
- การเปลี่ยน Model อัปเดต Capabilities และปรับ Telemetry เดิมให้เหลือเฉพาะ Temperature หรือ Pressure ตามรุ่น
- การเปลี่ยน Assigned User อัปเดต `assignedDeviceIds` ของ User เดิมและ User ใหม่ใน Shared State
- เพิ่ม Route `/admin/devices/:deviceId` สำหรับ Identity, Status และค่าล่าสุดแบบ Read-only; งาน Sensor, Chart, Valve Control และ History ยังคงอยู่ใน Phase 6
- Dashboard Device Status และ Valve Activity เชื่อมตรงไป Device Detail ของแต่ละเครื่อง
- Device ID ที่ไม่มีอยู่แสดง Not Found State ภายในหน้า และมีทางกลับรายการอุปกรณ์
- ตรวจ Add LPG365, แก้เป็น LPG365-P, Duplicate Serial, Search/Filter, Empty State, Refresh Persistence และ Device Detail ผ่านใน Browser
- ตรวจ Admin Route และ User Role Guard สำหรับทั้ง `/admin/devices` และ `/admin/devices/:deviceId` ผ่านใน Browser
- ตรวจ Responsive ที่ Desktop 1440px และ Mobile 390px; Layout หลักไม่ล้นแนวนอนและ Modal/Card ใช้งานได้
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2`, `npm run validate:phase4` และ `npm run validate:phase5` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 6 — Device Detail and Safe Valve Control

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 5  
**เป้าหมาย:** แสดงข้อมูลอุปกรณ์รายตัวและควบคุมวาล์วอย่างปลอดภัย

### งานที่ต้องทำ

- แสดง Device Identity, Model Badge, Customer และ Location
- แสดง Flow, Usage และค่าเฉพาะรุ่น
- สร้าง Sensor Card 3 จุดพร้อมสถานะ แบตเตอรี่ สัญญาณ และ Last Seen
- สร้าง Historical Chart พร้อมช่วง 24 ชั่วโมง, 7 วัน และ 30 วัน
- สร้าง Valve Control และ Confirmation Modal
- แสดงเหตุผลเมื่อปุ่ม Open Valve ถูก Disable
- บันทึก Valve Command History
- แสดง Alert History ของอุปกรณ์

### Acceptance Criteria

- ข้อมูลเปลี่ยนตาม Device ID ใน Route
- Metric และ Chart ตรงกับ Capability ของรุ่น
- Open/Close ต้องยืนยันก่อนทำงาน
- Active Critical Leak ทำให้ Open Valve ใช้งานไม่ได้
- Resolve Alert ไม่เปิดวาล์วโดยอัตโนมัติ
- ทุกคำสั่งถูกเพิ่มใน History พร้อมผู้สั่ง เวลา และผลลัพธ์
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/DeviceDetailPage.jsx`
- `src/components/SensorCard.jsx`
- `src/components/DeviceHistoryChart.jsx`
- `src/components/ValveControlPanel.jsx`
- `src/components/ConfirmModal.jsx`
- `src/services/valveService.js`
- `src/services/storageService.js`
- `src/services/simulatorService.js`
- `src/utils/deviceDetailSelectors.js`
- `src/data/telemetry.js`
- `src/styles/device-detail.css`
- `src/components/StatusBadge.jsx`
- `src/services/index.js`
- `src/main.jsx`
- `scripts/validatePhase2.mjs`
- `scripts/validatePhase6.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- ขยายข้อมูล Telemetry และขีดจำกัดการเก็บรักษาเป็น 720 จุดรายชั่วโมงต่ออุปกรณ์ เพื่อรองรับข้อมูลย้อนหลัง 30 วัน และปรับ Schema เป็น Version 2 สำหรับย้าย Demo Data เดิม
- หน้า Device Detail เปลี่ยนข้อมูลตาม Device ID และแสดง Identity, Model, Customer, Location, Connection, Valve, Protection และ Last Seen
- LPG365 แสดง Flow, Usage และ Temperature ส่วน LPG365-P แสดง Flow, Usage และ Pressure โดยไม่มี Metric หรือ Series ที่รุ่นนั้นไม่รองรับ
- แสดง Leak Sensor 3 จุดต่ออุปกรณ์ พร้อมสถานะ, Battery, Signal และ Last Seen รวมถึงสถานะ Offline และ Low Battery
- Historical Chart เลือกช่วง 24 ชั่วโมง, 7 วัน และ 30 วันได้ โดยตรวจแหล่งข้อมูลครบ 24, 168 และ 720 จุดตามลำดับ
- เพิ่ม Valve Control พร้อม Confirmation Modal, เหตุผลประกอบแบบไม่บังคับ, ปุ่มสถานะปัจจุบันที่ Disabled และข้อความอธิบายเมื่อสั่งงานไม่ได้
- อุปกรณ์ Offline ไม่สามารถ Open/Close; Active Leak Sensor หรือ Active Critical Alert ป้องกันการ Open; การ Close ยังคงทำได้เมื่ออุปกรณ์ Online และวาล์วเปิดอยู่
- การ Resolve Alert ไม่เปิดวาล์วอัตโนมัติ และ Sensor ที่ยังเป็น `LEAK` ยังคงป้องกันการ Open
- ทุกคำสั่งที่ผ่าน Service ถูกบันทึกพร้อม Device, Command, Reason, Requester, Timestamp, Result และ Error Code และหน้าแสดงประวัติล่าสุด 10 รายการ
- แสดง Alert History ล่าสุด 10 รายการของอุปกรณ์แบบ Read-only โดยงาน Acknowledge/Resolve ยังคงอยู่ใน Phase 7
- ตรวจการยืนยัน Open/Close, Cancel แล้วไม่เปลี่ยนสถานะ, การเพิ่ม Valve History, กราฟทุกช่วง, LPG365/LPG365-P และอุปกรณ์ Offline ผ่านใน Browser
- ตรวจ Responsive ที่ Desktop 1440×900 และ Mobile 390×844; ส่วน Identity, Metric, Valve และ Sensor เรียงตัวโดยไม่ล้นแนวนอน
- `npm run validate:phase2`, `npm run validate:phase4`, `npm run validate:phase5` และ `npm run validate:phase6` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 7 — Alerts and Incidents

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 6  
**เป้าหมาย:** ให้ Admin ตรวจสอบ กรอง รับทราบ และปิด Incident ได้

### งานที่ต้องทำ

- สร้าง Alert Summary และรายการ Incident
- เพิ่ม Filter ตาม Severity, Type, Status, Device และ Model
- เพิ่ม Acknowledge Action
- เพิ่ม Resolve Modal พร้อม Resolution Note
- แสดง Device, Model, Location, Sensor, Time และ Valve Action
- จำกัดประเภท Alert ตาม Capability:
  - LPG365: Temperature Alert
  - LPG365-P: Pressure Alert
- ใช้สีร่วมกับข้อความและไอคอน

### Acceptance Criteria

- Filter ทุกชนิดทำงานร่วมกันได้
- เปลี่ยน Open → Acknowledged → Resolved ได้
- LPG365 ไม่มี Pressure Alert
- LPG365-P ไม่มี Temperature Alert
- Resolve แล้ววาล์วยังคง Closed จนกว่าจะสั่งเปิดและยืนยันใหม่
- Critical Incident มองเห็นเด่นชัด
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/AlertsPage.jsx`
- `src/components/AlertIncidentCard.jsx`
- `src/components/ResolveAlertModal.jsx`
- `src/components/StatusBadge.jsx`
- `src/utils/alertSelectors.js`
- `src/styles/alerts.css`
- `src/main.jsx`
- `scripts/validatePhase7.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เปลี่ยนหน้า Alerts Placeholder เป็น Incident Management ที่อ่านและแก้ไขข้อมูลจาก Shared State
- เพิ่ม Summary สำหรับ Active Incidents, Active Critical, Acknowledged และ Resolved โดยคำนวณจากข้อมูลจริง
- เพิ่มตัวกรอง Severity, Alert Type, Status, Device และ Model ที่ทำงานร่วมกัน พร้อม Result Count, Clear Filters และ Empty State
- เรียง Incident จากเหตุการณ์ล่าสุดก่อน และแสดง Device, Model, Location, Sensor, เวลา และ Valve Action
- Valve Action เชื่อม Automation Valve Command ของอุปกรณ์เดียวกันภายในช่วงเวลาใกล้ Alert; หากไม่พบจะแสดงว่าไม่มีคำสั่งวาล์ว
- เพิ่ม Acknowledge แบบกดครั้งเดียวสำหรับสถานะ `OPEN` พร้อม Feedback และ Audit ผู้รับทราบ/เวลา
- เพิ่ม Resolve Modal สำหรับสถานะ `ACKNOWLEDGED` โดยบังคับกรอก Resolution Note พร้อมแสดงกฎว่า Resolve จะไม่เปิดวาล์วอัตโนมัติ
- สถานะเปลี่ยนตามลำดับ `OPEN → ACKNOWLEDGED → RESOLVED`; ไม่สามารถข้าม Acknowledge หรือ Resolve โดยไม่กรอก Note
- แสดง Audit ผู้รับทราบ ผู้ Resolve เวลา และ Resolution Note ใน Incident Card
- รองรับ Deep Link `?alert=<alertId>` จาก Dashboard และ Device Detail พร้อมเน้นและเลื่อนไปยัง Incident ที่มองเห็นจริงทั้ง Desktop/Mobile
- ใช้ Severity Badge, ข้อความ, ไอคอน และเส้นขอบร่วมกับสีเพื่อให้ Critical, Warning และ Info แยกแยะได้โดยไม่พึ่งสีเพียงอย่างเดียว
- LPG365 ปฏิเสธ Pressure Alert และรองรับ Temperature Alert; LPG365-P ปฏิเสธ Temperature Alert และรองรับ Pressure Alert
- ตรวจ Acknowledge, Resolve Modal, Note บังคับ, Feedback, Audit และ Refresh Persistence ผ่านใน Browser
- ตรวจตัวกรองทั้ง 5 ชนิดพร้อมกัน, Clear Filters และ Empty State ผ่านใน Browser
- ตรวจ Admin Route และ User Role Guard สำหรับ `/admin/alerts` ผ่านใน Browser
- ตรวจ Responsive ที่ Desktop 1440×900 และ Mobile 390×844; Desktop แสดง Table, Mobile แสดง Card และไม่มี Layout ล้นแนวนอน
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2`, `npm run validate:phase4`, `npm run validate:phase5`, `npm run validate:phase6` และ `npm run validate:phase7` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 8 — Device Simulator and Cross-page Updates

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 7  
**เป้าหมาย:** สาธิตเหตุการณ์และอัปเดตข้อมูลข้ามหน้าเหมือนระบบ Real-time

### งานที่ต้องทำ

- สร้าง Device Selector ใน Simulator
- สร้าง Telemetry Update ทุก 3–5 วินาที
- เพิ่ม Simulate Leak และ Simulate Offline สำหรับทั้งสองรุ่น
- เพิ่ม Abnormal Temperature สำหรับ LPG365
- เพิ่ม High Pressure สำหรับ LPG365-P
- เพิ่ม Reset Simulation พร้อม Confirmation
- สร้าง Event Log พร้อมเวลา Asia/Bangkok
- เชื่อม Leak Workflow:
  1. Sensor เปลี่ยนเป็น LEAK
  2. สร้าง Critical Alert
  3. ปิดวาล์วอัตโนมัติ
  4. บันทึก Valve Command และ Event Log
  5. Dashboard และ Device Detail อัปเดต

### Acceptance Criteria

- ปุ่ม Simulation เปลี่ยนตามรุ่นที่เลือก
- Simulate Leak ทำให้ Critical Alert และ Closed Valve เกิดกับอุปกรณ์เดียวกัน
- ค่าที่เปลี่ยนสะท้อนใน Admin Overview, Device Detail และ Alerts
- Reset คืนค่าเฉพาะข้อมูล Demo ตามขอบเขตที่อธิบายใน Modal
- ไม่มีข้อความอ้างว่าส่ง SMS หรือเชื่อมต่ออุปกรณ์จริง
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/SimulatorPage.jsx`
- `src/components/SimulatorDevicePanel.jsx`
- `src/components/SimulationControls.jsx`
- `src/components/SimulationEventLog.jsx`
- `src/components/ResetSimulationModal.jsx`
- `src/utils/simulatorSelectors.js`
- `src/services/simulatorService.js`
- `src/styles/simulator.css`
- `src/main.jsx`
- `scripts/validatePhase8.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เปลี่ยนหน้า Simulator Placeholder เป็น Device Simulator ที่อ่านและแก้ไข Shared State ชุดเดียวกับทุกหน้า
- เพิ่ม Device Selector พร้อม Model, Connection, Valve Status, Location และลิงก์ไป Device Detail
- เพิ่ม Live Metrics สำหรับ Flow และ Usage ของทั้งสองรุ่น โดย LPG365 แสดง Temperature และ LPG365-P แสดง Pressure เท่านั้น
- สร้าง Telemetry แบบ deterministic ทุก 4 วินาทีสำหรับทุกอุปกรณ์ที่ไม่ Offline ตลอดเวลาที่ Web App เปิดอยู่ และคำนวณ Usage เพิ่มจาก Flow ตามช่วงเวลาจริง
- คง Telemetry สูงสุด 720 จุดต่ออุปกรณ์และอัปเดต Last Seen ของอุปกรณ์เมื่อได้รับข้อมูลใหม่
- หยุดสร้าง Telemetry อัตโนมัติเมื่ออุปกรณ์ Offline พร้อมแสดงสถานะ Paused และ Disabled Controls
- เพิ่ม Sensor Selector 3 จุดและ Simulate Leak ซึ่งเปลี่ยน Sensor เป็น `LEAK`, สร้าง Critical Alert, ปิดวาล์วด้วย Automation และบันทึก Valve Command/Event Log
- ป้องกัน Leak ซ้ำบน Sensor ที่ยัง Active และกฎ Valve Safety ยังคงป้องกันการเปิดวาล์วระหว่าง Active Leak
- เพิ่ม Abnormal Temperature 52 °C เฉพาะ LPG365 และ High Pressure 88 PSI เฉพาะ LPG365-P พร้อม Warning Alert/Event Log
- เพิ่ม Simulate Offline ซึ่งเปลี่ยน Device และ Sensor ทั้ง 3 จุดเป็น Offline, สร้าง Warning Alert และป้องกันการจำลองซ้ำ
- จำกัด Event Log ใน State สูงสุด 100 รายการและแสดงล่าสุด 20 รายการของอุปกรณ์ที่เลือก พร้อมเวลา Asia/Bangkok
- เพิ่ม Reset Simulation Confirmation ที่อธิบายชัดเจนว่าจะคืน Users, Devices, Sensors, Telemetry, Alerts, Valve History และ Event Log แต่คง Session ปัจจุบัน
- แสดงข้อความชัดเจนว่าเป็น Frontend Prototype และไม่มี Frizzlife Cloud, MQTT, WebSocket, SMS หรืออุปกรณ์จริง
- ตรวจ Telemetry เปลี่ยนจริงหลัง 4 วินาที และ Event Log/Simulation State ยังคงอยู่หลัง Refresh ผ่านใน Browser
- ตรวจ LPG365 แสดง Temperature Action และ LPG365-P แสดง Pressure Action ผ่านใน Browser
- ตรวจ Leak → Critical Alert → Sensor LEAK → Valve CLOSED และผลสะท้อนใน Admin Overview, Device Detail และ Alerts ผ่านใน Browser
- ตรวจอุปกรณ์ Offline แสดง Telemetry Paused และปุ่ม Leak/Pressure/Offline ถูก Disable ผ่านใน Browser
- ตรวจ Reset Confirmation Modal โดยไม่สั่งลบข้อมูลระหว่าง Browser QA; ตรวจ Reset จริงและ Session Persistence ผ่าน Automated Validation
- ตรวจ Admin Route และ User Role Guard สำหรับ `/admin/simulator` ผ่านใน Browser
- ตรวจ Responsive ที่ Desktop 1440×900 และ Mobile 390×844 โดยไม่มี Layout ล้นแนวนอน
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2`, `npm run validate:phase4`, `npm run validate:phase5`, `npm run validate:phase6`, `npm run validate:phase7` และ `npm run validate:phase8` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 9 — User Dashboard and Role Isolation

**สถานะ:** Complete  
**Priority:** P1  
**ขึ้นต่อ:** Phase 8  
**เป้าหมาย:** สร้างหน้าผู้ใช้ที่เรียบง่ายและเห็นเฉพาะข้อมูลของตนเอง

### งานที่ต้องทำ

- แสดงเฉพาะอุปกรณ์ที่ Assigned ให้ User ปัจจุบัน
- แสดง Safety Status, Valve, Flow, Usage และ Metric เฉพาะรุ่น
- แสดง Sensor 3 จุดและ Personal Alerts
- แสดง Water Usage Chart และประวัติล่าสุด
- ใช้กฎ Valve Safety เดียวกับหน้า Admin
- เพิ่มการเปลี่ยนชื่อ/ตำแหน่ง Sensor หากเวลาพอ
- เพิ่ม Protection Toggle แบบจำลองหากเวลาพอ

### Acceptance Criteria

- User ไม่เห็นข้อมูลของ User คนอื่น
- User ไม่เห็นเมนู Admin, Simulator หรือ Device Management
- User เปิดวาล์วไม่ได้เมื่อมี Active Critical Leak
- LPG365 และ LPG365-P แสดง Metric ถูกต้อง
- การเปลี่ยนสถานะสะท้อนใน State กลาง
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/UserDashboardPage.jsx`
- `src/components/UserWaterUsageChart.jsx`
- `src/components/SensorEditModal.jsx`
- `src/components/SensorCard.jsx`
- `src/utils/userDashboardSelectors.js`
- `src/services/authService.js`
- `src/services/valveService.js`
- `src/services/sensorService.js`
- `src/services/index.js`
- `src/context/AppContext.jsx`
- `src/styles/user-dashboard.css`
- `src/main.jsx`
- `scripts/validatePhase9.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เปลี่ยนหน้า User Placeholder เป็น Dashboard ที่แสดงเฉพาะอุปกรณ์ใน `assignedDeviceIds` ของบัญชีปัจจุบัน
- บัญชี LPG365 เห็นอุปกรณ์ 1 เครื่อง และบัญชี LPG365-P เห็นอุปกรณ์ 2 เครื่องพร้อม Device Selector
- แสดง Safety Status, Connection, Valve, Protection แบบอ่านอย่างเดียว, Flow, Usage และ Personal Alerts
- LPG365 แสดง Water Temperature โดยไม่แสดง Pressure และ LPG365-P แสดง Water Pressure โดยไม่แสดง Temperature
- ใช้ Valve Control และ Confirmation ชุดเดียวกับหน้า Admin พร้อมเพิ่ม Authorization ใน Service ก่อนส่งคำสั่ง
- ปฏิเสธคำสั่งวาล์วที่ User ส่งไปยัง Device ID นอกบัญชี แม้ไม่ได้เรียกผ่าน UI
- แสดง Leak Sensor 3 จุด และเพิ่ม Modal แก้ไขเฉพาะชื่อกับตำแหน่งติดตั้ง
- ปฏิเสธการแก้ Sensor ของอุปกรณ์นอกบัญชี และข้อมูลที่แก้ยังคงอยู่หลัง Refresh ผ่าน `localStorage`
- แสดงกราฟ Flow, Temperature/Pressure, Water Usage รายวัน, ประวัติวาล์ว และ Personal Alerts แบบอ่านอย่างเดียว
- ไม่เพิ่ม Protection Toggle เพื่อไม่ให้ขัดกับกฎ Leak Simulation ที่ต้องปิดวาล์วอัตโนมัติ
- ตรวจ Direct URL จาก User ไป `/admin/devices` แล้วระบบแสดง Unauthorized 403
- ตรวจเมนู User แล้วพบเฉพาะ `ภาพรวมของฉัน` โดยไม่มี Admin, Device Management หรือ Simulator
- ตรวจ Active Leak/Critical Alert แล้วปุ่มเปิดวาล์วถูก Disable
- ตรวจ Responsive ที่ Desktop และ Mobile 390×844 โดย Mobile ไม่มี Horizontal Overflow
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2`, `npm run validate:phase4`, `npm run validate:phase5`, `npm run validate:phase6`, `npm run validate:phase7`, `npm run validate:phase8` และ `npm run validate:phase9` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0); Vite มีคำเตือนแบบไม่ขัดขวาง Build เรื่องขนาด Bundle จากการใช้ Recharts

---

## Phase 10 — Responsive, Accessibility and UI States

**สถานะ:** Complete  
**Priority:** P0 Desktop / P1 Mobile  
**ขึ้นต่อ:** Phase 9  
**เป้าหมาย:** ทำให้หน้าหลักใช้งานได้จริงและมีสถานะ UI ครบ

### งานที่ต้องทำ

- ตรวจที่ความกว้าง 1440px, 768px และ 390px
- เปลี่ยน Sidebar เป็น Mobile Drawer
- เปลี่ยน Table เป็น Card บน Mobile
- ตรวจ Chart, Modal และ Valve Control ไม่ล้นหน้าจอ
- เพิ่ม Loading, Empty, Error และ Disabled States
- ตรวจ Keyboard Focus, Label, Button Name และ Contrast
- ลดข้อความสองภาษาและใช้ภาษาไทยเป็นหลัก
- ตรวจคำกล่าวอ้างที่ไม่รองรับและวันที่ Hard-code

### Acceptance Criteria

- ไม่มี Horizontal Scroll ที่เกิดจาก Layout หลัก
- Critical Status และ Valve Control ยังมองเห็นและใช้งานได้บน Mobile
- ใช้ Keyboard เข้าถึง Interactive Elements หลักได้
- Status ทุกแบบมีข้อความหรือไอคอน ไม่พึ่งสีอย่างเดียว
- Empty/Error/Loading States แสดงได้โดยไม่ทำให้ Layout พัง
- Lint และ Build ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/App.jsx`
- `src/main.jsx`
- `src/components/AppErrorBoundary.jsx`
- `src/components/AppShell.jsx`
- `src/components/Header.jsx`
- `src/components/PageState.jsx`
- `src/components/Sidebar.jsx`
- `src/components/ConfirmModal.jsx`
- `src/components/DeviceFormModal.jsx`
- `src/components/ResetSimulationModal.jsx`
- `src/components/ResolveAlertModal.jsx`
- `src/components/SensorEditModal.jsx`
- `src/hooks/useFocusTrap.js`
- `src/hooks/useMediaQuery.js`
- `src/pages/AdminDashboardPage.jsx`
- `src/pages/SimulatorPage.jsx`
- `src/pages/UserDashboardPage.jsx`
- `src/styles/accessibility.css`
- `src/styles/dashboard.css`
- `src/styles/shell.css`
- `scripts/validatePhase10.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- แยกหน้า Login, Admin Dashboard, Device Management, Device Detail, Alerts, Simulator, User Dashboard, Unauthorized และ Not Found เป็น Lazy-loaded Route พร้อม Loading State กลางและ Error Boundary ระดับแอป
- เพิ่ม Skip Link ไปยัง `main-content`, Focus Style, Reduced Motion และ Page State สำหรับ Loading, Empty และ Error โดยใช้ภาษาไทยเป็นหลัก
- Mobile Sidebar ทำงานเป็น Drawer พร้อม `aria-expanded`, `aria-hidden`, `aria-modal`, `inert`, Escape to close, Focus Trap, Scroll Lock และคืน Focus ไปยังปุ่มเปิดเมนู
- Modal ทุกประเภทใช้ Focus Trap กลาง รองรับ Tab/Shift+Tab, Escape, Scroll Lock และคืน Focus ไปยัง Trigger ทั้งการเปิดด้วยเมาส์และคีย์บอร์ด
- Admin Dashboard เปลี่ยน Device Table เป็น Card ที่ความกว้าง Mobile; หน้า Devices และ Alerts ใช้ Mobile Card เดิมและซ่อน Table โดยไม่ทำให้ข้อมูลสำคัญหาย
- ตรวจ Login, Admin Dashboard, Devices, Device Detail, Alerts, Simulator, User Dashboard และ Not Found ที่ 1440×900, 768×1024 และ 390×844 แล้วไม่พบ Horizontal Overflow จาก Layout หลัก
- ตรวจ Mobile Drawer, Device/Sensor Modal, Empty State ของ Device Search, Disabled Valve State, 404 State และการคืน Focus หลังปิด Modal ผ่านใน Browser
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase2`, `npm run validate:phase4`, `npm run validate:phase5`, `npm run validate:phase6`, `npm run validate:phase7`, `npm run validate:phase8`, `npm run validate:phase9` และ `npm run validate:phase10` ผ่านทุก Scenario (exit code 0)
- `npm run lint` ผ่านโดยไม่มี Warning (exit code 0)
- `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0) และแยก Page Chunk สำเร็จโดยไม่มีคำเตือนเรื่อง Bundle เกิน 500 kB

---

## Phase 10.5 — User Management and Device Assignment

**สถานะ:** Complete  
**Priority:** P1  
**ขึ้นต่อ:** Phase 10  
**เป้าหมาย:** ให้ Admin จัดการบัญชี User จำลองและความสัมพันธ์ระหว่าง User กับอุปกรณ์ได้จากระบบหลังบ้าน

### งานที่ต้องทำ

- เพิ่ม Route และเมนู `/admin/users` สำหรับ Admin เท่านั้น
- แสดงรายการ User พร้อม Search, Status Filter และ Model Filter
- เพิ่มและแก้ไขชื่อ, Email และสถานะบัญชี
- กำหนด Role ของบัญชีใหม่เป็น `USER` และ Password จำลองเป็น `Demo1234`
- รองรับสถานะ `ACTIVE` และ `SUSPENDED`; บัญชีระงับ Login และเข้าถึงอุปกรณ์ไม่ได้
- ให้ User หนึ่งคนมีหลายอุปกรณ์ แต่อุปกรณ์หนึ่งเครื่องผูกได้กับ User เพียงคนเดียว
- แจ้งเตือนและขอยืนยันก่อนย้ายอุปกรณ์จาก User เดิม
- ซิงก์ `Device.assignedUserId` และ `User.assignedDeviceIds` ทุกครั้งที่บันทึก
- รองรับ Desktop Table, Mobile Card, Empty State และ Modal ที่เข้าถึงด้วย Keyboard

### Acceptance Criteria

- Admin เพิ่ม แก้ไข ค้นหา กรอง เปิดใช้งาน และระงับ User ได้
- Email ต้องไม่ซ้ำและต้องมีรูปแบบถูกต้อง
- การผูก ยกเลิกการผูก หรือย้ายอุปกรณ์ต้องสะท้อนทั้ง User และ Device
- บัญชี `SUSPENDED` Login ไม่ได้ และบัญชี `ACTIVE` กลับมา Login ได้
- User ไม่สามารถเปิด `/admin/users` ได้
- Refresh แล้วยังคงข้อมูลผ่าน `localStorage`
- ไม่มี Horizontal Overflow ที่ 1440px, 768px และ 390px
- Lint, Build และ Regression เดิมผ่าน

### ไฟล์หลักที่พัฒนา

- `src/pages/UsersPage.jsx`
- `src/components/UserFormModal.jsx`
- `src/services/userService.js`
- `src/services/authService.js`
- `src/services/index.js`
- `src/context/AppContext.jsx`
- `src/utils/userFilters.js`
- `src/data/users.js`
- `src/components/StatusBadge.jsx`
- `src/components/AppShell.jsx`
- `src/App.jsx`
- `src/styles/users.css`
- `src/main.jsx`
- `scripts/validatePhase105.mjs`
- `package.json`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เพิ่มเมนูและ Lazy-loaded Route `จัดการผู้ใช้` ใน Admin Shell โดย User Route Guard ยังคงแสดง Unauthorized 403
- แสดง Summary ของ User ทั้งหมด, Active, Suspended และบัญชีที่ยังไม่ผูกอุปกรณ์ พร้อม Search/Filter แบบใช้ร่วมกันได้
- Desktop แสดง Table และ Tablet/Mobile แสดง Card พร้อมชื่อ, Email, Status, Device และวันที่สร้าง
- เพิ่ม User Modal พร้อม Required Field, รูปแบบ Email, Email ซ้ำ, Status และ Device Assignment
- บัญชีใหม่ใช้ Role `USER` และ Password จำลอง `Demo1234` โดยไม่มีการเพิ่มระบบสมัครสมาชิกหรือ Backend
- การเลือกอุปกรณ์ที่มีเจ้าของอยู่แล้วจะแสดงชื่อเจ้าของเดิม และต้องกด `ยืนยันและย้ายอุปกรณ์` ก่อนบันทึก
- Service ใช้ `Device.assignedUserId` เป็นแหล่งข้อมูลหลักและซิงก์ `assignedDeviceIds` ของ User ทุกคนหลังการเพิ่มหรือแก้ไข
- บัญชี `SUSPENDED` ถูกปฏิเสธด้วยข้อความชัดเจนตอน Login และไม่มีสิทธิ์เข้าถึงอุปกรณ์
- ตรวจ Add Modal Validation, Move Confirmation, Suspend Login, Reactivate, Focus Restoration และ Admin/User Route Guard ผ่านใน Browser
- ตรวจที่ 1440×900, 768×1024 และ 390×844 แล้วไม่พบ Horizontal Overflow; Table/Card สลับตาม Breakpoint ถูกต้อง
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase10.5` ผ่านทุก Scenario รวม Email ซ้ำ, Device Move, Bidirectional Sync, Suspend และ Filter (exit code 0)
- `npm run lint` และ `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)

---

## Phase 10.6 — App-wide Telemetry Runtime

**สถานะ:** Complete  
**Priority:** P1  
**ขึ้นต่อ:** Phase 10.5  
**เป้าหมาย:** ให้ Telemetry จำลองทำงานต่อเนื่องขณะ Web App เปิดอยู่ โดยไม่ขึ้นกับ Route หรือหน้าที่ผู้ใช้กำลังเปิด

### งานที่ต้องทำ

- ย้าย Telemetry Timer จาก `SimulatorPage` ไปไว้ระดับ `AppProvider`
- อัปเดตอุปกรณ์ทุกเครื่องที่ไม่ Offline ใน State Change เดียวต่อรอบ
- คงกฎ Capabilities ของ LPG365 และ LPG365-P
- หยุด Telemetry สำหรับอุปกรณ์ Offline
- ป้องกัน Timer ซ้ำเมื่อเปิดหน้า Simulator
- ปรับข้อความใน Simulator ให้สื่อพฤติกรรม App-wide Runtime

### Acceptance Criteria

- Telemetry ทำงานทุก 4 วินาทีขณะอยู่ Dashboard, Alerts, Login, Simulator และ User Dashboard
- LPG365 มี Temperature และไม่มี Pressure
- LPG365-P มี Pressure และไม่มี Temperature
- อุปกรณ์ Offline ไม่มี Telemetry ใหม่
- หน้า Simulator ไม่มี Timer แยกและไม่สร้างข้อมูลซ้ำ
- User เห็นเฉพาะอุปกรณ์ที่ผูกกับบัญชีของตนเอง
- Refresh แล้วยังคงข้อมูลล่าสุดผ่าน `localStorage`
- Mobile ไม่มี Horizontal Overflow และ Browser Console ไม่มี Warning/Error
- Lint, Build และ Regression Phase 8/9 ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/context/AppContext.jsx`
- `src/services/simulatorService.js`
- `src/services/index.js`
- `src/pages/SimulatorPage.jsx`
- `PROJECT_PLAN.md`
- `DEVELOPMENT_PHASES.md`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- ย้าย `setInterval` ไปที่ `AppProvider` และเรียก Service เพื่ออัปเดตทุกอุปกรณ์ที่ไม่ Offline ในรอบเดียว
- ตรวจขณะเปลี่ยนจาก Admin Dashboard ไป Alerts แล้วกลับมา พบ Flow ของ LPG365 และ LPG365-P เปลี่ยนต่อเนื่อง ส่วนอุปกรณ์ Offline คงค่าเดิม
- ตรวจขณะอยู่หน้า Login เกิน 4 วินาทีแล้วกลับเข้า Admin พบ Telemetry ยังคงเปลี่ยนต่อ
- ตรวจหน้า Simulator แล้ว Live Metrics เปลี่ยนตาม Runtime กลาง และไม่มี Timer ภายในหน้าอีกต่อไป
- ตรวจบัญชี LPG365 User พบ Flow เปลี่ยนต่อเนื่องและไม่เห็น Serial Number ของบัญชีอื่น
- ตรวจบัญชี LPG365-P User พบ Pressure เปลี่ยนต่อเนื่องและไม่แสดง Temperature
- ตรวจ Simulator ที่ Mobile 390×844 แล้วไม่พบ Horizontal Overflow และข้อความ Runtime ใหม่แสดงครบ
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase8` และ `npm run validate:phase9` ผ่านทุก Scenario (exit code 0)
- `npm run lint` และ `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)

### ข้อจำกัดที่ยอมรับใน Prototype

- Runtime หยุดเมื่อปิด Web App และไม่สร้างข้อมูลย้อนหลังชดเชย
- Browser อาจลดความถี่ Timer เมื่อแท็บอยู่เบื้องหลัง
- ไม่ประสาน Timer ระหว่างหลายแท็บ เนื่องจากยังไม่มี Backend หรือ Shared Worker

---

## Phase 10.7 — Admin-only Leak Recovery Simulation

**สถานะ:** Complete  
**Priority:** P1  
**ขึ้นต่อ:** Phase 10.6  
**เป้าหมาย:** ให้ Admin จำลองเหตุการณ์ที่ลูกค้าแก้ไขจุดรั่วแล้ว พร้อมคืน Sensor และ Alert สู่สถานะที่ถูกต้องโดยไม่เปิดวาล์วอัตโนมัติ

### งานที่ต้องทำ

- เพิ่มปุ่ม `จำลองลูกค้าแก้ไขแล้ว` ในหน้า Simulator เฉพาะกรณีที่ Sensor ที่เลือกมี Leak Active
- ตรวจ Role ที่ Service และอนุญาตเฉพาะ Admin ไม่พึ่งเพียงการซ่อนปุ่มใน UI
- เปลี่ยน Sensor จาก `LEAK` เป็น `NORMAL`
- เปลี่ยน Alert ที่เกี่ยวข้องตามลำดับ `OPEN → ACKNOWLEDGED → RESOLVED`
- คง Valve เป็น `CLOSED` ตาม Safety Rule
- เพิ่ม Event Log ประเภท `Customer Fixed Leak`
- รองรับทั้ง LPG365 และ LPG365-P ด้วย Shared State ชุดเดียวกัน

### Acceptance Criteria

- Admin กดจำลองลูกค้าแก้ไขแล้วได้เมื่อ Sensor ที่เลือกมี Leak Active
- User เรียก Action เดียวกันไม่ได้และได้รับผล `ADMIN_REQUIRED`
- Sensor กลับเป็น Normal และ Alert ที่เกี่ยวข้องเป็น Resolved
- Valve ยังคง Closed หลังปิดเหตุการณ์
- ปุ่ม Recovery ถูก Disable เมื่อไม่มี Leak Active หรืออุปกรณ์ Offline
- Event Log ระบุผู้ดำเนินการ เวลา และข้อความว่าเป็นข้อมูลจำลอง
- ผลลัพธ์สะท้อนใน Alerts, Device Detail และ User Dashboard
- LPG365 และ LPG365-P ทำงานด้วยกฎเดียวกันโดย Metric เฉพาะรุ่นยังถูกต้อง
- Mobile ไม่มี Horizontal Overflow และ Browser Console ไม่มี Warning/Error
- Lint, Build และ Regression Phase 7/8/9 ผ่าน

### ไฟล์หลักที่พัฒนา

- `src/services/simulatorService.js`
- `src/services/index.js`
- `src/context/AppContext.jsx`
- `src/pages/SimulatorPage.jsx`
- `src/components/SimulationControls.jsx`
- `src/components/SimulationEventLog.jsx`
- `src/styles/simulator.css`
- `scripts/validatePhase8.mjs`
- `PROJECT_PLAN.md`
- `DEVELOPMENT_PHASES.md`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- เพิ่มปุ่ม Recovery ในหน้า Simulator และเปิดใช้งานเฉพาะ Sensor ที่มี Leak Active
- ตรวจ Service แล้ว User ถูกปฏิเสธด้วย `ADMIN_REQUIRED` ส่วน Admin ปิดเหตุการณ์ได้ตามลำดับสถานะ
- ตรวจ LPG365 และ LPG365-P แล้ว Sensor กลับเป็น Normal, Alert เป็น Resolved และ Valve ยังคง Closed
- ตรวจ Alerts, Device Detail และ User Dashboard แล้ว Shared State อัปเดตตรงกัน
- ตรวจ Direct URL ของ User ไป `/admin/simulator` แล้วระบบแสดง Unauthorized
- ตรวจ Simulator ที่ Mobile 390×844 แล้วไม่พบ Horizontal Overflow และ Control ใหม่แสดงครบ
- Browser Console ไม่มี Warning หรือ Error ระหว่างการทดสอบ
- `npm run validate:phase7`, `npm run validate:phase8` และ `npm run validate:phase9` ผ่านทุก Scenario (exit code 0)
- `npm run lint` และ `npm run build` ผ่านด้วย Vite 8.3.4 (exit code 0)

---

## Phase 11 — End-to-end QA, Documentation and Handoff

**สถานะ:** Complete  
**Priority:** P0  
**ขึ้นต่อ:** Phase 10.7  
**เป้าหมาย:** ตรวจระบบตาม Acceptance Criteria และเตรียมส่งผลงาน

### งานที่ต้องทำ

- รันทดสอบ Scenario ทั้ง 4 จาก `PROJECT_PLAN.md`
- ตรวจ Login และ Role Routing
- ตรวจ LPG365 และ LPG365-P อย่างน้อยรุ่นละ 1 เครื่อง
- ตรวจ Leak → Critical Alert → Auto Shutoff → Acknowledge → Resolve
- ตรวจว่า Resolve ไม่เปิดวาล์วอัตโนมัติ
- ตรวจ Refresh และ Reset Demo Data
- ตรวจ Console และแก้ Runtime Warning/Error
- เขียน README พร้อมวิธีติดตั้ง รัน Build และบัญชี Demo
- เตรียม Screenshot หน้าหลัก
- เตรียม Script และลำดับการอัดวิดีโอ 5–8 นาที

### Final Acceptance Criteria

- `npm run lint` ผ่าน
- `npm run build` ผ่าน
- เปิดระบบตาม README ได้
- Scenario สำคัญทำซ้ำได้โดยไม่ต้องแก้ข้อมูลด้วยมือ
- ไม่มีข้อความอ้างว่าเชื่อมต่ออุปกรณ์จริง
- ไม่มีข้อมูลส่วนบุคคลจริงใน Mock Data หรือ Screenshot
- Source Code, README, Mock Data, Simulator, Screenshot, Video Script/Shot List และเอกสารแผนครบ

### ไฟล์หลักที่พัฒนา

- `README.md`
- `docs/QA_CHECKLIST.md`
- `docs/VIDEO_SCRIPT.md`
- `docs/screenshots/*`
- `src/pages/DeviceDetailPage.jsx`
- `src/services/simulatorService.js`
- `src/styles/devices.css`
- `src/styles/alerts.css`
- `scripts/validatePhase8.mjs`
- `DEVELOPMENT_PHASES.md`

### ผลการตรวจจริง — 22 ตุลาคม 2026

- Validation Phase 2, 4, 5, 6, 7, 8, 9, 10 และ 10.5 ผ่านทั้งหมด
- `npm run lint` และ `npm run build` ผ่านด้วย Vite 8.3.4
- Login, Role Routing, Unauthorized 403 และการแยกอุปกรณ์ของ User ผ่าน Browser UI
- LPG365 แสดง Temperature และ LPG365-P แสดง Pressure ตาม Capability โดยไม่มีค่าปลอม
- Leak → Critical Alert → Auto Shutoff → Acknowledge → Resolve → ลูกค้าแก้ไขแล้ว ทำงานครบ และ Resolve ไม่เปิดวาล์วอัตโนมัติ
- Reset Demo Data ผ่าน Browser UI: กลับเป็น 3 อุปกรณ์, 2 Active Alerts และยังคง Admin Session หลัง Reload
- ตรวจ Desktop 1440×900, Tablet 768×1024 และ Mobile 390×844 โดยไม่มี Horizontal Overflow
- Mobile Drawer และ Modal รองรับ Keyboard พร้อมคืน Focus
- Browser Console ไม่มี Warning หรือ Error
- แก้ Audit Log ให้แยก Admin/User/Automation, แก้ Leak Recovery หลัง Manual Resolve และแก้ Tablet Overflow
- README, QA Checklist, Screenshot และ Script/Shot List สำหรับวิดีโอพร้อมส่งมอบ

### สิ่งที่ผู้สมัครต้องดำเนินการต่อ

- อัดไฟล์วิดีโอจริงตาม `docs/VIDEO_SCRIPT.md` ตามตัวเลือก Phase 11 แบบ A

---

## Progress Checklist

- [x] Phase 0 — Project Foundation
- [x] Phase 1 — Mock Data and Device Capability Rules
- [x] Phase 2 — Shared State, Services and Persistence
- [x] Phase 3 — App Shell, Routing and Mock Authentication
- [x] Phase 4 — Admin Overview Dashboard
- [x] Phase 5 — Device Management
- [x] Phase 6 — Device Detail and Safe Valve Control
- [x] Phase 7 — Alerts and Incidents
- [x] Phase 8 — Device Simulator and Cross-page Updates
- [x] Phase 9 — User Dashboard and Role Isolation
- [x] Phase 10 — Responsive, Accessibility and UI States
- [x] Phase 10.5 — User Management and Device Assignment
- [x] Phase 10.6 — App-wide Telemetry Runtime
- [x] Phase 10.7 — Admin-only Leak Recovery Simulation
- [x] Phase 11 — End-to-end QA, Documentation and Handoff

เมื่อ Phase ใดเสร็จ ให้เปลี่ยนสถานะของ Phase เป็น `Complete` ทำเครื่องหมาย Checklist และบันทึกผลการตรวจจริง ห้ามทำเครื่องหมาย Complete จากแผนหรือการคาดเดาเพียงอย่างเดียว
