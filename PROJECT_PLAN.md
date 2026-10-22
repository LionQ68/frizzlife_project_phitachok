# แผนพัฒนาระบบ Frizzlife Smart Water Management Dashboard

## 1. ภาพรวมโครงการ

พัฒนา Web Dashboard สำหรับเจ้าหน้าที่ดูแลอุปกรณ์ Frizzlife ตระกูล LPG365 ได้แก่ `LPG365` และ `LPG365-P` ซึ่งเป็นระบบตรวจวัดการใช้น้ำ ตรวจจับน้ำรั่ว และสั่งปิดวาล์วน้ำอัตโนมัติ โดยระบบต้องอ่านรุ่นของอุปกรณ์และแสดงความสามารถให้ถูกต้องตามรุ่น

- `LPG365`: แสดงอัตราการไหล ปริมาณการใช้น้ำ และอุณหภูมิน้ำ
- `LPG365-P`: แสดงอัตราการไหล ปริมาณการใช้น้ำ และแรงดันน้ำ

ระบบที่พัฒนาจะเป็นผลงานต้นแบบ (Prototype/MVP) ฝั่ง Frontend สำหรับสาธิตแนวคิดของระบบหลังบ้าน โดยใช้ข้อมูลจำลองจากไฟล์ JavaScript และ Device Simulator ภายใน Browser เนื่องจากยังไม่มีข้อมูลยืนยันว่าอุปกรณ์มี Public API สำหรับนักพัฒนา ข้อมูลที่ต้องการให้คงอยู่ระหว่างการสาธิตจะจัดเก็บด้วย `localStorage`

### เป้าหมายหลัก

- แสดงภาพรวมและสถานะของอุปกรณ์ทั้งหมด
- รองรับและแยกแยะอุปกรณ์รุ่น LPG365 และ LPG365-P
- ติดตามอัตราการไหล ปริมาณการใช้น้ำ และข้อมูลเฉพาะรุ่น ได้แก่ Temperature สำหรับ LPG365 หรือ Pressure สำหรับ LPG365-P
- แสดงสถานะวาล์วและ Leak Sensor ทั้ง 3 จุด
- แจ้งเตือนเมื่อพบเหตุการณ์ผิดปกติ
- จำลองคำสั่งเปิด–ปิดวาล์วจาก Dashboard
- แสดงประวัติเหตุการณ์และข้อมูลย้อนหลัง
- มีหน้าตา Responsive และพร้อมใช้ประกอบวิดีโอนำเสนอ

## 2. ขอบเขตการพัฒนา

### 2.1 ฟังก์ชันที่ต้องมีใน MVP

1. Dashboard Overview
   - จำนวนอุปกรณ์ทั้งหมด
   - จำนวนอุปกรณ์ Online และ Offline
   - จำนวน Active Alerts
   - ปริมาณการใช้น้ำวันนี้
   - กราฟอัตราการไหลย้อนหลัง
   - กราฟข้อมูลเฉพาะรุ่น: Temperature สำหรับ LPG365 หรือ Pressure สำหรับ LPG365-P
   - กราฟปริมาณการใช้น้ำรายวัน
   - เหตุการณ์ล่าสุด

2. Device Management
   - ดูรายการอุปกรณ์
   - ค้นหาและกรองตามสถานะ
   - เพิ่มและแก้ไขข้อมูลอุปกรณ์
   - ดูสถานะการเชื่อมต่อและเวลาที่ติดต่อครั้งล่าสุด
   - ดูสถานะวาล์ว
   - แสดงรุ่น LPG365 หรือ LPG365-P และกรองรายการตามรุ่น
   - เปิดหน้ารายละเอียดอุปกรณ์

3. Device Detail
   - Flow Rate ปัจจุบัน
   - Water Temperature ปัจจุบัน เมื่อเป็นรุ่น LPG365
   - Water Pressure ปัจจุบัน เมื่อเป็นรุ่น LPG365-P
   - Total Water Usage
   - สถานะวาล์ว
   - สถานะระบบป้องกัน
   - สถานะ Leak Sensor ทั้ง 3 จุด
   - กราฟข้อมูลย้อนหลัง
   - ประวัติคำสั่งเปิด–ปิดวาล์ว
   - ประวัติการแจ้งเตือนของอุปกรณ์

4. Leak Sensor Monitoring
   - ชื่อและตำแหน่งติดตั้งของแต่ละ Sensor
   - สถานะ Normal, Leak Detected หรือ Offline
   - ระดับแบตเตอรี่จำลอง
   - Signal Strength จำลอง
   - เวลาที่ติดต่อครั้งล่าสุด

5. Alerts and Incidents
   - แสดงรายการแจ้งเตือนทั้งหมด
   - ระดับความรุนแรง Critical, Warning และ Info
   - ประเภท Micro Leak, Sensor Leak, Abnormal Flow, Temperature, Pressure, Offline และ Low Battery
   - Temperature Alert ใช้เฉพาะ LPG365 และ Pressure Alert ใช้เฉพาะ LPG365-P
   - เปลี่ยนสถานะ Open, Acknowledged และ Resolved
   - กรองตามประเภท ความรุนแรง และสถานะ

6. Valve Control
   - สั่งเปิดหรือปิดวาล์วแบบจำลอง
   - แสดง Confirmation ก่อนดำเนินการ
   - บันทึกคำสั่งและผลลัพธ์ลงประวัติ
   - ปิดวาล์วอัตโนมัติเมื่อ Simulator จำลองเหตุการณ์น้ำรั่ว

7. Device Simulator
   - จำลอง Telemetry ทุก 4 วินาทีสำหรับทุกอุปกรณ์ที่ไม่ Offline ตลอดเวลาที่ Web App เปิดอยู่
   - จำลอง Flow Rate และ Water Usage สำหรับทั้งสองรุ่น
   - จำลอง Temperature สำหรับ LPG365 หรือ Pressure สำหรับ LPG365-P ตามรุ่นที่เลือก
   - ปุ่ม Simulate Leak
   - ปุ่ม Admin-only `จำลองลูกค้าแก้ไขแล้ว` สำหรับคืน Leak Sensor เป็น Normal และปิด Alert โดยคงวาล์วเป็น Closed
   - ปุ่ม Simulate Abnormal Temperature สำหรับ LPG365
   - ปุ่ม Simulate High Pressure สำหรับ LPG365-P
   - ปุ่ม Simulate Device Offline
   - ปุ่ม Reset Simulation
   - อัปเดต Dashboard แบบ Real-time

8. Authentication และ Role
   - หน้า Login สำหรับ User และ Admin
   - ใช้บัญชีตัวอย่างจาก Mock Data
   - เก็บสถานะ Login และ Role ใน `localStorage`
   - แยกเมนูและสิทธิ์ตาม Role
   - ระบุชัดเจนว่าเป็น Mock Authentication สำหรับการสาธิตเท่านั้น

9. User Management
   - Admin ดู ค้นหา และกรองบัญชี User ตามสถานะและรุ่นอุปกรณ์
   - เพิ่มและแก้ไขบัญชี User จำลอง โดย Role ถูกกำหนดเป็น `USER`
   - เปิดใช้งานหรือระงับบัญชีโดยไม่ลบข้อมูลและประวัติ
   - ผูกอุปกรณ์หลายเครื่องกับ User หนึ่งคน โดยอุปกรณ์หนึ่งเครื่องมี User ได้เพียงคนเดียว
   - แจ้งเตือนและยืนยันก่อนย้ายอุปกรณ์จาก User เดิม
   - บัญชีใหม่ใช้ Password จำลอง `Demo1234` และเก็บข้อมูลด้วย `localStorage`

### 2.2 การรองรับรุ่นอุปกรณ์

| ความสามารถ | LPG365 | LPG365-P |
|---|---:|---:|
| Flow Rate | รองรับ | รองรับ |
| Water Usage | รองรับ | รองรับ |
| Water Temperature | รองรับ | ไม่แสดง |
| Water Pressure | ไม่แสดง | รองรับ |
| Leak Sensor | รองรับ | รองรับ |
| Valve Control และ Auto Shutoff | รองรับ | รองรับ |

ระบบจะอ่าน `model` และ `capabilities` จากข้อมูลอุปกรณ์ ไม่ตรวจรุ่นด้วยข้อความที่เขียนกระจัดกระจายในหน้า Component เพื่อให้เพิ่มรุ่นใหม่ภายหลังได้ง่าย หากอุปกรณ์ไม่มีความสามารถใด ให้ซ่อนส่วนนั้นหรือแสดง `ไม่รองรับในรุ่นนี้` ห้ามสร้างค่าจำลองของ Sensor ที่รุ่นนั้นไม่มี

### 2.3 ฟังก์ชันที่ไม่อยู่ใน MVP

- เชื่อมต่อ Frizzlife Cloud หรืออุปกรณ์จริง
- ส่ง SMS หรือโทรศัพท์จริง
- Push Notification จริง
- ระบบชำระเงินหรือ E-commerce
- Mobile Application
- AI/ML สำหรับเรียนรู้พฤติกรรมการใช้น้ำจริง
- Multi-tenant สำหรับหลายบริษัท
- Firmware Update จากระยะไกล
- ระบบสมัครสมาชิก ส่ง Email ยืนยัน ลืมรหัสผ่าน หรือเปลี่ยนรหัสผ่านจริง

ฟังก์ชันเหล่านี้สามารถนำเสนอเป็น Future Improvements ได้

## 3. ผู้ใช้งานระบบ

### User — เจ้าของบ้านหรือลูกค้า

- ดูเฉพาะอุปกรณ์ที่ผูกกับบัญชีของตนเอง
- ดู Flow Rate, Water Usage และค่า Temperature หรือ Pressure ตามรุ่นอุปกรณ์ของตนเอง
- ดูสถานะวาล์วและ Leak Sensor ทั้ง 3 จุด
- ดู Alert และประวัติเหตุการณ์ของอุปกรณ์ตนเอง
- สั่งเปิด–ปิดวาล์วของตนเอง โดยต้องกดยืนยันก่อน
- เปลี่ยนชื่อและตำแหน่งติดตั้ง Sensor
- เปิดหรือปิดระบบป้องกันแบบจำลอง

### Admin — เจ้าหน้าที่บริษัท

- ดู Dashboard และอุปกรณ์ทั้งหมดในระบบ
- เพิ่ม แก้ไข ค้นหา และกรองอุปกรณ์
- ผูกอุปกรณ์กับ User
- เพิ่ม แก้ไข ค้นหา กรอง และระงับบัญชี User จำลอง
- ผูก ยกเลิกการผูก และย้ายอุปกรณ์ระหว่าง User โดยต้องยืนยันก่อนย้าย
- ตรวจสอบ Device, Sensor และ Alert ทุกเครื่อง
- กรองและตรวจสอบอุปกรณ์ตามรุ่น LPG365 หรือ LPG365-P
- สั่งเปิด–ปิดวาล์วของทุกอุปกรณ์
- รับทราบและปิด Incident
- ดูประวัติคำสั่งและ Audit Log
- เรียกใช้ Device Simulator

> MVP จะเน้น Admin Dashboard เป็นหลัก ส่วน User Dashboard จะแสดงเฉพาะข้อมูลและการควบคุมอุปกรณ์ของตนเอง

## 4. หน้าจอของระบบ

| หน้า | จุดประสงค์ | ส่วนประกอบสำคัญ |
|---|---|---|
| Login | เข้าสู่ระบบ | Email, Password, Demo Account |
| Admin Overview | ดูภาพรวมทั้งระบบ | KPI Cards, Model Summary, Charts, Device Status, Recent Alerts |
| User Dashboard | ดูอุปกรณ์ของตนเอง | Model-aware Water Metrics, Valve Status, Sensors, Personal Alerts |
| Devices | จัดการอุปกรณ์ | Search, Status/Model Filter, Device Table, Add/Edit Device |
| Users | จัดการผู้ใช้ | Search, Status/Model Filter, Add/Edit/Suspend User, Device Assignment |
| Device Detail | ตรวจสอบอุปกรณ์รายตัว | Model Badge, Model-aware Live Metrics, Valve Control, Sensors, Charts, History |
| Alerts | จัดการเหตุการณ์ | Severity, Type, Status, Acknowledge, Resolve |
| Simulator | จำลองการทำงาน | Model Selector, Live Data, Leak/Temperature/Pressure/Offline Controls, Reset |
| Settings | ตั้งค่าระบบต้นแบบ | Threshold และค่าการจำลอง |

## 5. User Flow สำคัญ

### Flow A: ตรวจพบ Leak Sensor

```text
Leak Sensor ตรวจพบน้ำ
        ↓
Simulator ส่ง Leak Event
        ↓
Simulator สร้าง Critical Alert ใน State ของแอป
        ↓
ระบบสั่งปิดวาล์วอัตโนมัติ
        ↓
Dashboard อัปเดตสถานะ Real-time
        ↓
Admin ตรวจสอบและกด Acknowledge
        ↓
แก้ไขปัญหาและเปลี่ยนเป็น Resolved
```

### Flow B: ตรวจพบ Micro Leak จากอัตราการไหล

```text
พบ Flow ต่อเนื่องในช่วงที่ไม่ควรใช้น้ำ
        ↓
สร้าง Warning Alert
        ↓
แสดงค่า Flow และระยะเวลาที่ตรวจพบ
        ↓
Admin ตรวจสอบข้อมูลย้อนหลัง
        ↓
Admin เลือกปิดวาล์วหรือ Resolve เหตุการณ์
```

### Flow C: สั่งควบคุมวาล์ว

```text
Admin กด Open/Close Valve
        ↓
แสดงหน้าต่างยืนยัน
        ↓
สร้าง Valve Command
        ↓
Simulator ตอบกลับ Success/Failed
        ↓
อัปเดต Valve Status และ Audit Log
```

### Flow D: ตรวจสอบและแสดงข้อมูลตามรุ่น

```text
ระบบโหลดข้อมูลอุปกรณ์
        ↓
อ่านค่า model และ capabilities
        ↓
LPG365 → แสดง Flow + Usage + Temperature
LPG365-P → แสดง Flow + Usage + Pressure
        ↓
Simulator และ Alert เปิดใช้เฉพาะ Event ที่รุ่นนั้นรองรับ
```

## 6. เทคโนโลยีที่เลือกใช้

### Application Stack

- Language: JavaScript
- Frontend: React
- Build Tool: Vite
- Styling: Plain CSS แยกตามหน้าและ Component
- Routing: React Router
- UI Components: React Component ที่สร้างเอง
- Charts: Recharts
- Icons: Lucide React
- Mock Data: ไฟล์ JavaScript/JSON
- State Management: `useState`, `useEffect` และ Context API เมื่อจำเป็น
- Persistence สำหรับ Demo: `localStorage`
- Authentication: Mock Login และ Role-based UI
- Real-time สำหรับ Demo: `setInterval` ระดับ `AppProvider` เพื่อให้ Telemetry ทำงานต่อเนื่องขณะเปลี่ยนหน้า

### เหตุผลที่เลือก

- JavaScript เหมาะกับผู้เริ่มต้นและสามารถอ่านหรือแก้ไขภายหลังได้ง่าย
- React แบ่งหน้าจอออกเป็น Component ที่มีหน้าที่ชัดเจน
- Vite เริ่มโปรเจกต์และเปิด Development Server ได้รวดเร็ว
- Plain CSS ทำให้เห็นความสัมพันธ์ระหว่างชื่อ Class และ Style โดยตรง
- Mock Data ลดความเสี่ยงจากการตั้งค่า Backend และ Database ไม่ทัน
- เมื่อเข้าใจ Frontend แล้วสามารถเพิ่ม Node.js, Express และ SQLite ภายหลังได้โดยยังใช้ภาษา JavaScript เหมือนเดิม

## 7. สถาปัตยกรรมระบบ

```text
Browser / User and Admin Dashboard
  └── React + Vite Application
        ├── Pages
        ├── Reusable Components
        ├── React Router
        ├── Mock Authentication
        ├── Mock Data
        ├── Alert Rules
        ├── Device Simulator
        └── localStorage
```

MVP จะทำงานภายใน Browser ทั้งหมด จึงเปิดเดโมได้ง่ายด้วย `npm run dev` และไม่ต้องติดตั้ง Database Server

### แนวทาง Production ในอนาคต

```text
Physical Device → MQTT Broker → Device Service → PostgreSQL/Time-series DB
                                      │
                                      ├── Alert Service
                                      ├── Notification Service
                                      └── WebSocket Gateway → Dashboard
```

## 8. โครงสร้างข้อมูล

### User

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| name | String | ชื่อผู้ใช้ |
| email | String | Email สำหรับ Login |
| password | String | Password สำหรับบัญชี Demo เท่านั้น |
| role | Enum | ADMIN, USER |
| accountStatus | Enum | ACTIVE, SUSPENDED |
| assignedDeviceIds | String[] | Device ID ที่ User มีสิทธิ์เข้าถึง |
| createdAt | DateTime | วันที่สร้าง |

### Device

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| serialNumber | String | Serial number |
| name | String | ชื่ออุปกรณ์ |
| model | Enum | LPG365, LPG365-P |
| packageVariant | String | เช่น 3S สำหรับชุดที่มี Leak Sensor 3 ตัว |
| capabilities | Object | เช่น flow, usage, temperature, pressure, leakSensors, valveControl |
| assignedUserId | String? | User ที่ผูกกับอุปกรณ์; หนึ่งอุปกรณ์มี User ได้หนึ่งคน |
| location | String | สถานที่ติดตั้ง |
| status | Enum | ONLINE, OFFLINE, WARNING |
| valveStatus | Enum | OPEN, CLOSED, CLOSING, OPENING |
| protectionEnabled | Boolean | เปิดระบบป้องกันหรือไม่ |
| firmwareVersion | String | เวอร์ชัน Firmware จำลอง |
| lastSeenAt | DateTime | ติดต่อครั้งล่าสุด |
| createdAt | DateTime | วันที่เพิ่มอุปกรณ์ |

### LeakSensor

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| deviceId | String | อ้างอิง Device |
| name | String | ชื่อ Sensor |
| zone | String | จุดติดตั้ง |
| status | Enum | NORMAL, LEAK, OFFLINE |
| batteryLevel | Integer | ระดับแบตเตอรี่ 0–100 |
| signalStrength | Integer | Signal strength จำลอง |
| lastSeenAt | DateTime | ติดต่อครั้งล่าสุด |

### Telemetry

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| deviceId | String | อ้างอิง Device |
| flowRate | Float | GPM |
| temperature | Float? | °C สำหรับ LPG365; เป็น `null` สำหรับ LPG365-P |
| pressure | Float? | PSI สำหรับ LPG365-P; เป็น `null` สำหรับ LPG365 |
| usageTotal | Float | ปริมาณใช้น้ำสะสม |
| recordedAt | DateTime | เวลาที่วัดค่า |

### ตัวอย่างอุปกรณ์สำหรับ Demo

| Device ID | Model | ความสามารถหลัก |
|---|---|---|
| LPG365-TH-001 | LPG365-P | Flow, Usage, Pressure, 3 Leak Sensors, Valve |
| LPG365-TH-002 | LPG365 | Flow, Usage, Temperature, 3 Leak Sensors, Valve |
| LPG365-TH-003 | LPG365-P | Flow, Usage, Pressure, 3 Leak Sensors, Valve |

### Alert

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| deviceId | String | อ้างอิง Device |
| sensorId | String? | Sensor ที่เกี่ยวข้อง |
| type | Enum | ประเภทเหตุการณ์ |
| severity | Enum | CRITICAL, WARNING, INFO |
| status | Enum | OPEN, ACKNOWLEDGED, RESOLVED |
| title | String | หัวข้อแจ้งเตือน |
| message | String | รายละเอียด |
| createdAt | DateTime | เวลาที่เกิด |
| resolvedAt | DateTime? | เวลาที่แก้ไข |

### ValveCommand

| Field | Type | รายละเอียด |
|---|---|---|
| id | String | Primary key |
| deviceId | String | อ้างอิง Device |
| command | Enum | OPEN, CLOSE |
| source | Enum | USER, AUTOMATION |
| status | Enum | PENDING, SUCCESS, FAILED |
| requestedBy | String? | ผู้สั่งงาน |
| createdAt | DateTime | เวลาสั่งงาน |
| completedAt | DateTime? | เวลาที่ทำงานสำเร็จ |

## 9. โครงสร้างไฟล์และบริการจำลอง

```text
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── StatCard.jsx
│   ├── DeviceTable.jsx
│   ├── SensorCard.jsx
│   └── ConfirmModal.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── AdminDashboardPage.jsx
│   ├── UserDashboardPage.jsx
│   ├── DevicesPage.jsx
│   ├── DeviceDetailPage.jsx
│   ├── AlertsPage.jsx
│   └── SimulatorPage.jsx
├── data/
│   ├── users.js
│   ├── devices.js
│   ├── telemetry.js
│   └── alerts.js
├── services/
│   ├── authService.js
│   ├── deviceService.js
│   ├── alertService.js
│   └── simulatorService.js
├── styles/
│   ├── global.css
│   ├── layout.css
│   └── dashboard.css
├── App.jsx
└── main.jsx
```

Service ใน MVP เป็นฟังก์ชัน JavaScript ที่อ่านและแก้ไข Mock Data เช่น `login()`, `getDevices()`, `getDeviceCapabilities()`, `toggleValve()`, `simulateLeak()` และ `resolveAlert()` เพื่อให้ภายหลังสามารถเปลี่ยนภายใน Service ไปเรียก REST API จริงได้โดยไม่ต้องแก้หน้า UI ทั้งระบบ

### API สำหรับพัฒนาต่อในอนาคต

เมื่อเพิ่ม Backend ด้วย Node.js และ Express จึงค่อยสร้าง Endpoint เช่น `/api/auth/login`, `/api/devices`, `/api/alerts` และ `/api/devices/:id/valve`

## 10. หลักการออกแบบ UI

- ใช้โทนสีน้ำเงิน น้ำเงินเข้ม และ Cyan สื่อถึงน้ำและเทคโนโลยี
- สีเขียวสำหรับสถานะปกติ
- สีส้มสำหรับ Warning
- สีแดงสำหรับ Critical และ Leak Detected
- ตัวเลขสำคัญต้องมองเห็นได้ภายใน 3 วินาที
- Valve Status และ Active Leak ต้องเด่นกว่าข้อมูลทั่วไป
- รองรับ Desktop เป็นหลักและใช้งานบน Tablet/Mobile ได้
- แสดง Model Badge ชัดเจนใน Device List และ Device Detail
- กราฟต้องใช้หน่วยให้ถูกต้อง: GPM และ Gallon สำหรับทั้งสองรุ่น, °C สำหรับ LPG365 และ PSI สำหรับ LPG365-P
- เมื่อเปลี่ยนอุปกรณ์ กราฟรองต้องเปลี่ยนระหว่าง Temperature และ Pressure ตาม `capabilities`
- ทุกคำสั่งที่เปลี่ยนสถานะวาล์วต้องมี Confirmation

## 11. แผนการพัฒนา

เป้าหมายคือทำระบบให้เสร็จพร้อมตรวจสอบภายในวันที่ 22 ตุลาคม 2026 เวลา 13:00 น. และเหลือเวลาเผื่อก่อนกำหนดส่งทางอีเมลเวลา 15:00 น.

รายละเอียดลำดับงานย่อย เกณฑ์ผ่าน และการตรวจสอบของแต่ละ Phase อยู่ใน `DEVELOPMENT_PHASES.md`

### ช่วงที่ 1: Setup และ Foundation

- ใช้โปรเจกต์ React + Vite + JavaScript ที่ติดตั้งไว้แล้ว
- ติดตั้ง React Router, Recharts และ Lucide React
- กำหนด Theme และ Layout
- สร้าง Mock Data ในไฟล์ JavaScript
- เพิ่มข้อมูล LPG365 และ LPG365-P พร้อม `capabilities` ของแต่ละรุ่น
- สร้าง Mock Login และกำหนด Role เป็น User/Admin
- สร้าง Navigation และ Routing

### ช่วงที่ 2: Dashboard Core

- สร้าง KPI Cards
- สร้าง Flow, Usage และกราฟรองที่สลับเป็น Temperature หรือ Pressure ตามรุ่น
- สร้าง Water Usage Chart
- สร้าง Device Status และ Recent Alerts
- ตรวจ Responsive Layout

### ช่วงที่ 3: Device และ Alert Management

- สร้าง Device List
- เพิ่ม Model Badge และตัวกรองรุ่น
- สร้าง Device Detail
- สร้าง Leak Sensor Cards
- สร้าง Alert List และ Status Actions
- สร้าง Valve Control

### ช่วงที่ 4: Simulator และ Interaction

- สร้างข้อมูล Telemetry จำลอง
- จำลอง Leak และ Offline สำหรับทั้งสองรุ่น
- จำลอง Abnormal Temperature สำหรับ LPG365 และ High Pressure สำหรับ LPG365-P
- เชื่อมการปิดวาล์วอัตโนมัติ
- อัปเดต Dashboard และ Alert State

### ช่วงที่ 5: QA และส่งมอบ

- ทดสอบ User Flow หลัก
- ตรวจสี หน่วย ตัวเลข และข้อความ
- ตรวจ Desktop และ Mobile
- เพิ่ม Empty, Loading และ Error State
- เขียน README และวิธีรัน
- เตรียมข้อมูลสำหรับวิดีโอ

## 12. ลำดับความสำคัญเมื่อเวลาไม่พอ

### P0 — ต้องเสร็จ

- Dashboard Overview
- Device Detail
- รองรับ LPG365 และ LPG365-P ด้วย Model/Capability Detection
- Flow/Usage และ Temperature/Pressure Charts ตามรุ่น
- Leak Sensor Status
- Alert List
- Valve Open/Close Simulation
- Simulate Leak และ Automatic Shutoff
- Responsive Desktop Layout

### P1 — ควรมี

- Login
- Device CRUD
- Alert Acknowledge/Resolve
- localStorage สำหรับเก็บสถานะ Demo
- User Dashboard แบบย่อ
- Mobile Layout

### P2 — ตัดออกได้

- User Management
- Settings ขั้นสูง
- Animation ซับซ้อน
- Export Report
- Dark Mode

## 13. เกณฑ์ตรวจรับงาน

ระบบถือว่าพร้อมส่งเมื่อผ่านเงื่อนไขต่อไปนี้:

- เปิดโปรเจกต์ตาม README ได้
- Dashboard แสดงข้อมูลตัวอย่างครบและไม่เกิด Runtime Error
- มีอุปกรณ์ตัวอย่างทั้ง LPG365 และ LPG365-P อย่างน้อยรุ่นละ 1 เครื่อง
- ระบบแสดง Model Badge ถูกต้องและสามารถกรองรายการตามรุ่นได้
- LPG365 แสดง Flow, Usage และ Temperature โดยไม่สร้างค่า Pressure
- LPG365-P แสดง Flow, Usage และ Pressure โดยไม่สร้างค่า Temperature
- กราฟ Flow, Temperature/Pressure และ Usage แสดงหน่วยถูกต้องตามรุ่น
- มีอุปกรณ์ตัวอย่างอย่างน้อย 3 เครื่อง
- อุปกรณ์แต่ละเครื่องมี Leak Sensor 3 ตัว
- ผู้ใช้เปิดหน้ารายละเอียดอุปกรณ์ได้
- ผู้ใช้สั่งเปิด–ปิดวาล์วแบบจำลองได้
- เมื่อกด Simulate Leak ระบบสร้าง Critical Alert และปิดวาล์ว
- ผู้ใช้ Acknowledge และ Resolve Alert ได้
- หน้าใช้งานได้บนความกว้าง Desktop และ Mobile
- ไม่มีข้อมูลที่กล่าวอ้างว่าเชื่อมต่ออุปกรณ์จริง

## 14. Test Scenarios สำหรับสาธิต

### Scenario 1: ระบบทำงานปกติ

1. Login เข้าสู่ Dashboard
2. แสดงอุปกรณ์ Online
3. Flow และ Temperature/Pressure เปลี่ยนตามรุ่นและข้อมูลจำลอง
4. Sensor ทั้ง 3 จุดแสดง Normal

### Scenario 2: เกิดน้ำรั่ว

1. เข้า Simulator
2. เลือก Sensor ใต้ซิงก์
3. กด Simulate Leak
4. Dashboard แสดง Critical Alert
5. Valve เปลี่ยนจาก Open เป็น Closed
6. เปิด Device Detail เพื่อดูประวัติเหตุการณ์
7. กด Acknowledge และ Resolve

### Scenario 3: สั่งวาล์วด้วยผู้ใช้

1. เปิด Device Detail
2. กด Open Valve
3. ยืนยันคำสั่ง
4. แสดงสถานะกำลังดำเนินการ
5. สถานะเปลี่ยนเป็น Open และบันทึก History

### Scenario 4: เปลี่ยนรุ่นอุปกรณ์

1. เลือก LPG365-TH-002 ซึ่งเป็น LPG365
2. ตรวจว่า Dashboard แสดง Flow, Usage และ Temperature โดยไม่มี Pressure
3. เปลี่ยนเป็น LPG365-TH-001 ซึ่งเป็น LPG365-P
4. ตรวจว่า Dashboard แสดง Flow, Usage และ Pressure โดยไม่มี Temperature
5. ตรวจว่า Simulator แสดงปุ่ม Abnormal Temperature หรือ High Pressure ให้ตรงกับรุ่น

## 15. โครงวิดีโอนำเสนอ

ระยะเวลาแนะนำ 5–8 นาที

1. แนะนำปัญหาและผลิตภัณฑ์ — 45 วินาที
2. อธิบายการรองรับ LPG365 และ LPG365-P ด้วย Capability-based UI — 45 วินาที
3. แสดง Architecture และ Technology — 60 วินาที
4. Demo Dashboard และ Device Detail — 90 วินาที
5. Demo Leak Detection และ Automatic Shutoff — 90 วินาที
6. อธิบายข้อจำกัดของ Mock API — 30 วินาที
7. สรุปสิ่งที่จะพัฒนาต่อ — 30 วินาที

## 16. ความเสี่ยงและแนวทางรับมือ

| ความเสี่ยง | แนวทางรับมือ |
|---|---|
| ไม่มี Public API ของอุปกรณ์ | ใช้ Device Simulator และระบุเป็น Mock อย่างชัดเจน |
| แสดง Telemetry หรือฟังก์ชันผิดรุ่น | กำหนด `capabilities` ใน Mock Data และให้ทุกหน้าตรวจจากข้อมูลชุดเดียวกัน |
| เวลาพัฒนาจำกัด | ทำ P0 ก่อนและตัด P2 ออก |
| Dependency ติดตั้งไม่ได้ | ลดการพึ่งพา Library และใช้ Component พื้นฐาน |
| ข้อมูลหายเมื่อ Refresh | บันทึกข้อมูล Demo ที่จำเป็นใน localStorage และมีปุ่ม Reset |
| กราฟหรือ Real-time ไม่เสถียร | ใช้ข้อมูลจำลองแบบ deterministic และ `setInterval` |
| Demo เกิดข้อผิดพลาด | เตรียม Reset Simulation และข้อมูลเริ่มต้น |

## 17. Future Improvements

- เชื่อมต่ออุปกรณ์จริงผ่าน MQTT หรือ Vendor API
- เพิ่ม Backend ด้วย Node.js และ Express
- เพิ่ม SQLite สำหรับการเรียนรู้ แล้วเปลี่ยนเป็น PostgreSQL/Time-series Database เมื่อใช้งานจริง
- ส่ง Push Notification, SMS และโทรศัพท์จริง
- รองรับหลายบ้าน หลายลูกค้า และหลายองค์กร
- สร้างกฎ Threshold แยกตามอุปกรณ์
- วิเคราะห์รูปแบบการใช้น้ำและตรวจจับความผิดปกติด้วย Machine Learning
- Export รายงาน PDF/CSV
- Firmware และ Device Health Management
- Mobile Application สำหรับเจ้าของบ้าน

## 18. ผลลัพธ์ที่ต้องส่งมอบ

- Source code ของระบบ
- README พร้อมวิธีติดตั้งและเปิดใช้งาน
- Mock Data ของ LPG365 และ LPG365-P พร้อมบัญชี Demo สำหรับ User/Admin
- Demo Account
- Device Simulator
- Screenshots สำคัญของระบบ
- วิดีโออธิบายแนวคิดและสาธิตการใช้งาน
- เอกสารแผนระบบฉบับนี้

---

เอกสารฉบับนี้จัดทำโดยอ้างอิงความสามารถของ Frizzlife LPG365 และ LPG365-P โดย LPG365 ใช้ Flow + Temperature และ LPG365-P ใช้ Flow + Pressure ระบบที่พัฒนาเป็นผลงานต้นแบบและไม่ได้เชื่อมต่อกับอุปกรณ์หรือบริการ Cloud ของผู้ผลิตจริง
