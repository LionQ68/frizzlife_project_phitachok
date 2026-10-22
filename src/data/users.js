const now = Date.now()

export const users = [
  {
    id: 'admin-001',
    name: 'ผู้ดูแลระบบตัวอย่าง',
    email: 'admin@frizzlife.demo',
    password: 'Demo1234',
    role: 'ADMIN',
    accountStatus: 'ACTIVE',
    assignedDeviceIds: [],
    isDemo: true,
    createdAt: new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-365-001',
    name: 'ผู้ใช้งานตัวอย่าง LPG365',
    email: 'user_365@frizzlife.demo',
    password: 'Demo1234',
    role: 'USER',
    accountStatus: 'ACTIVE',
    assignedDeviceIds: ['device-365-001'],
    isDemo: true,
    createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-365p-001',
    name: 'ผู้ใช้งานตัวอย่าง LPG365-P',
    email: 'user_365p@frizzlife.demo',
    password: 'Demo1234',
    role: 'USER',
    accountStatus: 'ACTIVE',
    assignedDeviceIds: ['device-365p-001', 'device-365p-002'],
    isDemo: true,
    createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
