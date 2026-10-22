# Video Script — Frizzlife Smart Water Dashboard

ระยะเวลาเป้าหมาย: **ประมาณ 7 นาที**  
รูปแบบ: อัดหน้าจอพร้อมเสียงผู้สมัคร  
ภาษา: ไทย โดยคงชื่อรุ่น หน่วย และ Technical Terms เป็นภาษาอังกฤษ

## เตรียมก่อนอัด

1. เปิด Terminal ที่ `D:\\Frizzlife_project` แล้วรัน `npm run dev`
2. เปิด `http://127.0.0.1:5173` และ Login ด้วย Admin Demo
3. เปิด Simulator แล้วกด `คืนข้อมูลจำลอง` เพื่อเริ่มจากข้อมูลมาตรฐาน
4. ตั้ง Zoom Browser เป็น 100% และความละเอียดอย่างน้อย 1440×900
5. ปิด Notification และ Tab ที่ไม่เกี่ยวข้อง

## 0:00–0:40 — แนะนำโจทย์

**หน้าจอ:** Login

> สวัสดีครับ ผลงานนี้คือ Frizzlife Smart Water Dashboard เป็นระบบหลังบ้านต้นแบบสำหรับจัดการอุปกรณ์ LPG365 และ LPG365-P ช่วยติดตามการใช้น้ำ ตรวจจับน้ำรั่ว และควบคุมวาล์วจากข้อมูลชุดเดียวกัน ผลงานนี้เป็น Frontend Prototype และใช้ข้อมูลจำลองทั้งหมด ไม่มีการเชื่อมต่ออุปกรณ์จริงครับ

ชี้ข้อความ Prototype, Login Form เดียว และบัญชี Demo

## 0:40–1:15 — Architecture และ Stack

> ผมเลือก React กับ JavaScript เพื่อแบ่งหน้าจอเป็น Component ที่เข้าใจและแก้ไขง่าย ใช้ React Router สำหรับ Route, Context API เป็น Shared State, Recharts สำหรับกราฟ และ localStorage สำหรับคงข้อมูลระหว่าง Refresh ส่วน Business Rules แยกไว้ใน Service Layer ครับ

อธิบายว่า MVP ไม่มี Backend/Database และ Role Guard ตรวจสิทธิ์จริง

## 1:15–2:05 — Admin Dashboard

**หน้าจอ:** `/admin/dashboard`

> Dashboard แสดงจำนวนและสถานะอุปกรณ์ Active Alerts การใช้น้ำ กราฟ และกิจกรรมล่าสุด ทุกหน้าอ่าน Shared State ชุดเดียวกัน เมื่อ Simulator เปลี่ยนข้อมูล Dashboard, Device Detail และ Alerts จึงอัปเดตตรงกันครับ

เปลี่ยน Device Selector และชี้ KPI, Charts, Device Status, Alerts, Valve Activity

## 2:05–2:50 — LPG365 และ LPG365-P

> ระบบใช้ Capability-based UI ครับ LPG365 แสดง Flow, Usage และ Temperature ส่วน LPG365-P แสดง Flow, Usage และ Pressure และจะไม่สร้างค่าที่รุ่นไม่รองรับเป็นเลขศูนย์ปลอม

สาธิต `LPG365-TH-002` กับ Temperature แล้วเปลี่ยนเป็น `LPG365-TH-001` กับ Pressure

## 2:50–3:30 — User/Device Management

**หน้าจอ:** `/admin/users` และ `/admin/devices`

> Admin เพิ่ม แก้ไข ระงับ User และผูกอุปกรณ์ได้ อุปกรณ์หนึ่งเครื่องมีเจ้าของได้หนึ่งบัญชี หากย้ายเครื่อง ระบบขอ Confirmation ก่อน ส่วนหน้าจัดการอุปกรณ์รองรับค้นหา กรอง เพิ่ม และแก้ไข Mock Device ครับ

## 3:30–4:40 — Leak และ Automatic Shutoff

**หน้าจอ:** `/admin/simulator`

> เมื่อกดจำลองน้ำรั่ว ระบบเปลี่ยน Sensor เป็น Leak สร้าง Critical Alert และปิดวาล์วอัตโนมัติ เหตุการณ์และคำสั่งถูกบันทึกไว้เพื่อ Audit ครับ

1. เลือก LPG365-P และ Kitchen Sensor
2. กด `จำลองน้ำรั่ว`
3. ชี้ `LEAK`, Critical Event และ `Valve CLOSED`
4. เปิด Dashboard เพื่อดู Active Alert ที่เพิ่มขึ้น

## 4:40–5:30 — Incident และ Safety Rule

**หน้าจอ:** `/admin/alerts` แล้วกลับ Simulator

> Incident ใช้ลำดับ Open, Acknowledged และ Resolved การ Resolve ต้องมีหมายเหตุและจะไม่เปิดวาล์วอัตโนมัติ หลังลูกค้าแจ้งว่าแก้ไขแล้ว Admin จึงคืน Sensor เป็น Normal แต่วาล์วยังคง Closed จนกว่าจะตรวจสอบและเปิดโดยตั้งใจครับ

กด Acknowledge, Resolve, ใส่ Note แล้วกลับไปกด `จำลองลูกค้าแก้ไขแล้ว`

## 5:30–6:15 — User Dashboard และ Role Isolation

**หน้าจอ:** Login ด้วย `user_365p@frizzlife.demo`

> User เห็นเฉพาะอุปกรณ์ของบัญชีตนเองและ Metric ตามรุ่น สามารถตรวจ Sensor, Personal Alerts และสั่งวาล์วผ่าน Confirmation แต่ไม่เห็นเมนู Admin และเปิด Admin URL โดยตรงไม่ได้ครับ

สาธิต Pressure, Sensors, Valve Confirmation และ Unauthorized 403

## 6:15–6:50 — Quality และข้อจำกัด

> ระบบผ่าน Validation ทุก Phase, Lint, Production Build และ Responsive QA ที่ Desktop, Tablet และ Mobile ข้อจำกัดคือยังไม่มี Public API, Backend หรือ Production Authentication ข้อมูลจึงอยู่ใน Browser เท่านั้น หากพัฒนาต่อจะเพิ่ม API Server, Database, MQTT หรือ Vendor API และ Notification จริงครับ

## 6:50–7:10 — สรุป

> ผลงานนี้ครอบคลุม Device Capability, Role Permission, Incident Workflow, Safety Rule และ Responsive UI โดยระบุชัดเจนว่าส่วนใดเป็นข้อมูลจำลอง ขอบคุณสำหรับการพิจารณาครับ

## Shot List

| ลำดับ | หน้าจอ | จุดสำคัญ |
|---:|---|---|
| 1 | Login | Prototype notice และ Demo Accounts |
| 2 | Admin Dashboard | KPI, Charts, Device Status |
| 3 | LPG365/LPG365-P | Temperature เทียบ Pressure |
| 4 | User Management | User และ Device Assignment |
| 5 | Simulator ก่อน/หลัง Leak | Normal → Leak, Valve Closed |
| 6 | Alerts | Open → Acknowledged → Resolved |
| 7 | Simulator Recovery | Customer Fixed และ Sensor Normal |
| 8 | User Dashboard | Assigned Device และ Valve Control |
| 9 | Unauthorized | User เข้า Admin Route ไม่ได้ |
| 10 | README/QA | Tests, Limitations และ Future Work |

## Code Screenshot สำหรับใช้ระหว่างอธิบาย

ใช้ภาพเหล่านี้เป็นภาพแทรกสั้น ๆ ประมาณ 3–6 วินาที โดยไม่จำเป็นต้องอ่านโค้ดทุกบรรทัด

| ช่วงเวลา | ประเด็นที่พูด | Screenshot โค้ด | จุดที่ควรชี้ |
|---|---|---|---|
| 0:40–1:15 | React Context และ Shared State | [08-code-shared-state.png](screenshots/08-code-shared-state.png) | `AppProvider`, `appState`, `currentUser` และ Service imports |
| 0:40–1:15 | เก็บข้อมูลใน Browser | [12-code-local-storage.png](screenshots/12-code-local-storage.png) | `STORAGE_KEYS`, `localStorage` และ Schema Validation |
| 2:05–2:50 | Capability-based UI | [09-code-device-capabilities.png](screenshots/09-code-device-capabilities.png) | LPG365 ใช้ Temperature และ LPG365-P ใช้ Pressure |
| 3:30–4:40 | Leak และ Auto Shutoff | [10-code-leak-auto-shutoff.png](screenshots/10-code-leak-auto-shutoff.png) | Sensor → `LEAK`, Critical Alert และคำสั่ง `CLOSE` จาก Automation |
| 5:30–6:15 | Role Isolation | [11-code-role-guard.png](screenshots/11-code-role-guard.png) | ตรวจ `allowedRoles` และส่งไป `/unauthorized` |

คำแนะนำในการตัดต่อ: เริ่มจากหน้าจอ Web App ก่อน จากนั้นแทรก Screenshot โค้ดที่ตรงกับคำอธิบาย แล้วกลับมาสาธิตผลลัพธ์บนหน้า Web App

## Checklist ก่อนส่งวิดีโอ

- [ ] ความยาว 5–8 นาทีและเสียงชัด
- [ ] ไม่แสดงข้อมูลส่วนตัวจริง
- [ ] ไม่กล่าวว่าเชื่อมต่ออุปกรณ์จริง
- [ ] แสดง LPG365 และ LPG365-P อย่างน้อยรุ่นละหนึ่งครั้ง
- [ ] แสดง Leak → Auto Shutoff → Resolve → Customer Fixed
- [ ] แสดง Role Isolation
- [ ] กล่าวถึงข้อจำกัดและแนวทางพัฒนาต่อ
