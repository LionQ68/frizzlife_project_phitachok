# Frizzlife Smart Water Dashboard

ระบบหลังบ้านต้นแบบสำหรับจัดการอุปกรณ์ตรวจวัดน้ำและวาล์วปิดน้ำอัตโนมัติในตระกูล **Frizzlife LPG365** พัฒนาด้วย React และ JavaScript เพื่อใช้เป็นผลงานสมัครตำแหน่ง Developer (นักศึกษาฝึกงาน)

> โปรเจกต์นี้เป็น Frontend Prototype ข้อมูลผู้ใช้ อุปกรณ์ Telemetry และเหตุการณ์ทั้งหมดเป็นข้อมูลจำลองภายใน Browser ไม่มีการเชื่อมต่อ Frizzlife Cloud, MQTT, WebSocket หรืออุปกรณ์จริง

## ความสามารถหลัก

- Dashboard ภาพรวมอุปกรณ์ การใช้น้ำ และเหตุการณ์สำคัญ
- รองรับ `LPG365` และ `LPG365-P` ด้วย Capability-based UI
- จัดการอุปกรณ์ ผู้ใช้ และการผูกอุปกรณ์กับผู้ใช้
- Device Detail พร้อม Telemetry, Leak Sensors และประวัติวาล์ว
- ควบคุมวาล์วจำลองพร้อม Confirmation และ Safety Rule
- Alerts/Incidents ตามลำดับ `OPEN → ACKNOWLEDGED → RESOLVED`
- Device Simulator สำหรับ Leak, Temperature, Pressure และ Offline
- Telemetry จำลองทุก 4 วินาทีขณะ Web App เปิดอยู่
- แยกสิทธิ์ Admin/User ทั้งระดับ Route และ Service
- เก็บสถานะ Demo ใน `localStorage` และ Reset กลับค่าเริ่มต้นได้
- Responsive สำหรับ Desktop, Tablet และ Mobile

## ความแตกต่างของอุปกรณ์

| ความสามารถ | LPG365 | LPG365-P |
|---|---:|---:|
| Flow Rate | รองรับ | รองรับ |
| Water Usage | รองรับ | รองรับ |
| Water Temperature | รองรับ | ไม่รองรับ |
| Water Pressure | ไม่รองรับ | รองรับ |
| Leak Sensors 3 จุด | รองรับ | รองรับ |
| Valve Control / Auto Shutoff | รองรับ | รองรับ |

ระบบจะไม่สร้างหรือแสดง Pressure ให้ LPG365 และจะไม่สร้างหรือแสดง Temperature ให้ LPG365-P

## บัญชี Demo

หน้า Login มี Form เดียว ระบบอ่าน Role จากบัญชีและ Redirect อัตโนมัติ ผู้ใช้ไม่สามารถเลือก Role เองได้

| บัญชี | Email | Password | สิทธิ์ |
|---|---|---|---|
| Admin Demo | `admin@frizzlife.demo` | `Demo1234` | จัดการข้อมูลจำลองทั้งหมด |
| LPG365 User | `user_365@frizzlife.demo` | `Demo1234` | เห็นเฉพาะ LPG365 ที่ผูกกับบัญชี |
| LPG365-P User | `user_365p@frizzlife.demo` | `Demo1234` | เห็นเฉพาะ LPG365-P ที่ผูกกับบัญชี |

Authentication เป็น Mock Authentication สำหรับการสาธิตเท่านั้น ไม่มี Bearer Token และไม่ใช่ระบบรักษาความปลอดภัยสำหรับ Production

## Technology Stack

- React 19 + JavaScript/JSX
- Vite 8
- React Router 7
- Recharts
- Lucide React
- Plain CSS
- Context API + Service Layer
- Mock Data + `localStorage`
- Oxlint

โปรเจกต์นี้ไม่ใช้ TypeScript, Backend หรือ Database

## ความต้องการของระบบ

- Node.js `^20.19.0` หรือ `>=22.12.0`
- npm
- Browser รุ่นปัจจุบัน เช่น Microsoft Edge หรือ Google Chrome

เวอร์ชันที่ใช้ตรวจส่งมอบคือ Node.js `v24.13.0` และ npm `11.6.2`

## วิธีติดตั้งและเปิดใช้งาน

เปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน:

```bash
npm install
npm run dev
```

จากนั้นเปิด URL ที่ Vite แสดง โดยปกติคือ `http://127.0.0.1:5173`

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

ชุดตรวจสอบกฎธุรกิจ:

```bash
npm run validate:phase2
npm run validate:phase4
npm run validate:phase5
npm run validate:phase6
npm run validate:phase7
npm run validate:phase8
npm run validate:phase9
npm run validate:phase10
npm run validate:phase10.5
```

## เส้นทางหลัก

| เส้นทาง | ผู้ใช้ | หน้าที่ |
|---|---|---|
| `/login` | ทุกคน | Login ด้วยบัญชี Demo |
| `/admin/dashboard` | Admin | ภาพรวมระบบ |
| `/admin/devices` | Admin | จัดการอุปกรณ์ |
| `/admin/users` | Admin | จัดการผู้ใช้และผูกอุปกรณ์ |
| `/admin/alerts` | Admin | Acknowledge/Resolve Incident |
| `/admin/simulator` | Admin | จำลอง Telemetry และเหตุการณ์ |
| `/user/dashboard` | User | Dashboard ของอุปกรณ์ที่ผูกกับบัญชี |

## Demo Flow แนะนำ

1. Login ด้วย Admin Demo และเปิดหน้า Dashboard
2. เปรียบเทียบ LPG365 ซึ่งแสดง Temperature กับ LPG365-P ซึ่งแสดง Pressure
3. เปิด Simulator เลือก Leak Sensor และกด `จำลองน้ำรั่ว`
4. ตรวจว่าเกิด Critical Alert และวาล์วถูกปิดอัตโนมัติ
5. เปิดหน้า Alerts แล้วกด Acknowledge และ Resolve
6. กลับ Simulator แล้วกด `จำลองลูกค้าแก้ไขแล้ว`
7. ตรวจว่า Sensor กลับเป็น Normal แต่ Valve ยังคง Closed
8. Login ด้วย User และตรวจว่าเห็นเฉพาะอุปกรณ์ของบัญชีนั้น

รายละเอียดคำพูดและลำดับการอัดวิดีโออยู่ใน [docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md)

## Safety Rules ของ Prototype

- ทุกคำสั่งวาล์วเป็นคำสั่งจำลอง
- ต้องยืนยันก่อนเปิดหรือปิดวาล์ว
- เปิดวาล์วไม่ได้เมื่ออุปกรณ์ Offline หรือมี Active Leak/Critical Incident
- Leak Simulation สร้าง Critical Alert และปิดวาล์วอัตโนมัติ
- Resolve Incident และการจำลองลูกค้าแก้ไขแล้วจะไม่เปิดวาล์วอัตโนมัติ
- เฉพาะ Admin เท่านั้นที่ใช้ Device Simulator และปิด Leak Simulation ได้

## การจัดเก็บข้อมูลและ Reset

State ของ Demo เก็บใน `localStorage` ด้วย Key `frizzlife-demo-state-v1` และ `frizzlife-demo-session-v1`

Admin สามารถเปิดหน้า Simulator แล้วกด `คืนข้อมูลจำลอง` เพื่อคืน Users, Devices, Sensors, Telemetry, Alerts, Valve History และ Event Log เป็นค่าเริ่มต้น โดย Session Login ปัจจุบันจะยังคงอยู่

## โครงสร้างสำคัญ

```text
src/
├── components/    Reusable UI และ Modal
├── context/       Shared App State
├── data/          Mock Data
├── pages/         หน้าจอตาม Route
├── services/      Business Rules และ Persistence
├── styles/        Plain CSS แยกตามหน้าที่
└── utils/         Selector, Filter และ Formatter
scripts/           Validation Scripts ของแต่ละ Phase
docs/              QA Checklist, Video Script และ Screenshots
```

## Screenshots

| หน้าจอ | ไฟล์ |
|---|---|
| Login | [01-login.jpg](docs/screenshots/01-login.jpg) |
| Admin Dashboard | [02-admin-dashboard.jpg](docs/screenshots/02-admin-dashboard.jpg) |
| Leak Simulator | [03-device-simulator-leak.jpg](docs/screenshots/03-device-simulator-leak.jpg) |
| Alerts & Incidents | [04-alerts-and-incidents.jpg](docs/screenshots/04-alerts-and-incidents.jpg) |
| LPG365-P User Dashboard | [05-user-dashboard-lpg365p.jpg](docs/screenshots/05-user-dashboard-lpg365p.jpg) |
| User Management | [06-user-management.jpg](docs/screenshots/06-user-management.jpg) |
| Dashboard หลัง Reset Demo Data | [07-reset-demo-data-verified.png](docs/screenshots/07-reset-demo-data-verified.png) |
| Shared State และ Telemetry Runtime | [08-code-shared-state.png](docs/screenshots/08-code-shared-state.png) |
| Device Capability Rules | [09-code-device-capabilities.png](docs/screenshots/09-code-device-capabilities.png) |
| Leak และ Automatic Shutoff | [10-code-leak-auto-shutoff.png](docs/screenshots/10-code-leak-auto-shutoff.png) |
| Role Guard และ Unauthorized | [11-code-role-guard.png](docs/screenshots/11-code-role-guard.png) |
| localStorage และ Schema | [12-code-local-storage.png](docs/screenshots/12-code-local-storage.png) |

## เอกสารประกอบ

- [PROJECT_PLAN.md](PROJECT_PLAN.md) — ขอบเขตและสถาปัตยกรรมระบบ
- [DEVELOPMENT_PHASES.md](DEVELOPMENT_PHASES.md) — ลำดับการพัฒนาและผลตรวจแต่ละ Phase
- [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) — ผลตรวจ End-to-end
- [docs/VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md) — Script วิดีโอ 5–8 นาที

## ข้อจำกัด

- ไม่มี Public API หรือการเชื่อมต่ออุปกรณ์จริง
- ไม่มี Backend, Database หรือ Production Authentication
- ข้อมูลแยกตาม Browser และไม่ซิงก์ระหว่างอุปกรณ์หรือหลายแท็บ
- Telemetry หยุดเมื่อปิด Web App และ Browser อาจลดความถี่ Timer ในแท็บเบื้องหลัง
- SMS, Push Notification และการโทรศัพท์จริงเป็น Future Improvement

## ผลการตรวจส่งมอบ

- Validation Phase 2–10.5 ผ่านทั้งหมด
- Lint ผ่านโดยไม่มี Warning
- Production Build ผ่านด้วย Vite 8.3.4
- Browser E2E ผ่านทั้ง Admin, LPG365 User และ LPG365-P User
- ตรวจ Desktop 1440×900, Tablet 768×1024 และ Mobile 390×844 แล้วไม่มี Horizontal Overflow
- Browser Console ไม่มี Warning หรือ Error

ดูรายละเอียดแต่ละกรณีได้ที่ [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md)
