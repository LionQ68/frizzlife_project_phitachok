# Phase 11 — End-to-end QA Checklist

วันที่ตรวจ: 22 ตุลาคม 2026  
Timezone: Asia/Bangkok  
Environment: Node.js v24.13.0, npm 11.6.2, Vite 8.3.4, Chromium-based in-app browser

## Automated Validation

| รายการ | ผล |
|---|---|
| Validation Phase 2, 4, 5, 6, 7, 8, 9, 10 และ 10.5 | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |

## Authentication และ Role

- [x] หน้า Login มี Form เดียวและตรวจ Role จากบัญชี
- [x] Admin Redirect ไป `/admin/dashboard`
- [x] User ทั้งสองรุ่น Redirect ไป `/user/dashboard`
- [x] User เปิด `/admin/devices` โดยตรงแล้วได้ Unauthorized 403
- [x] User เห็นเฉพาะอุปกรณ์ที่ผูกกับบัญชี
- [x] Login ระบุว่าเป็น Mock Authentication และไม่มี Bearer Token

## Scenario 1 — ระบบทำงานปกติ

- [x] Admin Dashboard แสดงสถานะอุปกรณ์และ Active Alerts
- [x] Telemetry เปลี่ยนทุก 4 วินาทีขณะ Web App เปิดอยู่
- [x] LPG365 แสดง Flow, Usage และ Temperature โดยไม่มี Pressure
- [x] LPG365-P แสดง Flow, Usage และ Pressure โดยไม่มี Temperature
- [x] Sensor ทั้งสามจุดแสดงสถานะและ Battery/Signal

## Scenario 2 — Leak และ Incident Lifecycle

- [x] เปิดวาล์วจำลองก่อนเริ่ม Scenario ได้เมื่อไม่มี Active Leak
- [x] Simulate Leak เปลี่ยน Sensor เป็น `LEAK`
- [x] สร้าง Critical Alert และปิดวาล์วอัตโนมัติ
- [x] Dashboard, Alerts และ Device Detail เห็น Shared State ตรงกัน
- [x] Acknowledge เปลี่ยนสถานะเป็น `ACKNOWLEDGED`
- [x] Resolve ต้องกรอก Resolution Note และเปลี่ยนเป็น `RESOLVED`
- [x] Resolve ไม่เปิดวาล์วอัตโนมัติ
- [x] Admin กด `จำลองลูกค้าแก้ไขแล้ว` หลัง Resolve ได้
- [x] Sensor กลับ `NORMAL`, Valve ยังคง `CLOSED` และบันทึก Event
- [x] User เรียก Leak Recovery Service ไม่ได้ (`ADMIN_REQUIRED`)

## Scenario 3 — Valve Control

- [x] Admin และเจ้าของอุปกรณ์เปิด/ปิดวาล์วจำลองได้
- [x] มี Confirmation ก่อนส่งคำสั่ง
- [x] บันทึกผู้สั่ง เหตุผล เวลา และผลลัพธ์ใน History
- [x] Audit Log แยก `Admin`, `User` และ `Automation` ถูกต้อง
- [x] Active Leak/Critical Incident และ Offline ป้องกันการเปิดวาล์ว

## Scenario 4 — Device Capabilities

- [x] LPG365 แสดง Temperature และ Abnormal Temperature
- [x] LPG365-P แสดง Pressure และ High Pressure
- [x] ไม่มีค่าศูนย์ปลอมสำหรับ Capability ที่รุ่นไม่รองรับ
- [x] ทุกหน้าใช้ Capability Rules ตรงกัน

## User และ Device Management

- [x] Admin เห็นเฉพาะบัญชี Role User ในหน้าจัดการผู้ใช้
- [x] Validation ครอบคลุม Add/Edit/Suspend/Reactivate และ Email ซ้ำ
- [x] การย้ายอุปกรณ์ต้องยืนยันและซิงก์ทั้งสองฝั่ง
- [x] Suspended User Login ไม่ได้

## Persistence และ Reset

- [x] Refresh แล้วยังคง Device, Alert, Sensor, Event และ Valve State
- [x] Reset Service คืนข้อมูลเริ่มต้นและคง Session ตาม Automated Validation
- [x] ยืนยันปุ่ม Reset ผ่าน Browser UI — กลับเป็น 3 อุปกรณ์, 2 Active Alerts และยังคง Admin Session หลัง Reload

## Responsive และ Accessibility

- [x] Desktop 1440×900 ไม่มี Horizontal Overflow
- [x] Tablet 768×1024 ไม่มี Horizontal Overflow
- [x] Mobile 390×844 ไม่มี Horizontal Overflow
- [x] หน้า Devices เปลี่ยนจาก Table เป็น Cards ที่ความกว้างไม่เกิน 840px
- [x] Mobile Drawer ปิดด้วย Keyboard และคืน Focus
- [x] Modal ปิดด้วย Escape และคืน Focus ให้ Trigger
- [x] หน้า 404 และ Unauthorized มีข้อความและทางกลับ
- [x] Browser Console ไม่มี Warning หรือ Error

## Bug ที่พบและแก้ใน Phase 11

1. Audit Log จาก Admin เคยแสดงประเภทผู้สั่งเป็น `User` — แก้ให้แสดง `Admin`
2. Leak Recovery หลัง Resolve จากหน้า Alerts เคยหา Active Alert ไม่พบ — แก้ให้รองรับ Alert ที่ Resolved แล้ว
3. หน้า Devices ที่ Tablet 768px เคย Horizontal Overflow — แก้ให้แสดง Device Cards ที่ ≤840px

## Deliverables

- [x] Source Code, README, Mock Data และ Simulator
- [x] Screenshots หน้าสำคัญ
- [x] Project Plan, Development Phases และ QA Checklist
