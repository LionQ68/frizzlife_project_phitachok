import assert from 'node:assert/strict'
import {
  addUser,
  authenticateUser,
  createInitialAppState,
  getDevicesForUser,
  updateUser,
} from '../src/services/index.js'
import { createUserListItems, filterUserItems } from '../src/utils/userFilters.js'

let state = createInitialAppState()
const initialUserItems = createUserListItems(state.users, state.devices)

assert.equal(initialUserItems.length, 2)
assert.ok(initialUserItems.every(({ user }) => user.role === 'USER'))

const deviceToMove = state.devices.find(({ model }) => model === 'LPG365-P')
const previousOwnerId = deviceToMove.assignedUserId
const createOutcome = addUser(state, {
  name: 'ผู้ใช้งานทดสอบ',
  email: 'new_user@frizzlife.demo',
  accountStatus: 'ACTIVE',
  assignedDeviceIds: [deviceToMove.id],
})

assert.equal(createOutcome.result.success, true)
assert.equal(createOutcome.result.user.role, 'USER')
assert.equal(createOutcome.result.user.password, 'Demo1234')
state = createOutcome.state

const createdUser = state.users.find(({ email }) => email === 'new_user@frizzlife.demo')
const movedDevice = state.devices.find(({ id }) => id === deviceToMove.id)
const previousOwner = state.users.find(({ id }) => id === previousOwnerId)

assert.equal(movedDevice.assignedUserId, createdUser.id)
assert.deepEqual(createdUser.assignedDeviceIds, [deviceToMove.id])
assert.equal(previousOwner.assignedDeviceIds.includes(deviceToMove.id), false)
assert.deepEqual(getDevicesForUser(state, createdUser).map(({ id }) => id), [deviceToMove.id])

const duplicateOutcome = addUser(state, {
  name: 'Email ซ้ำ',
  email: 'NEW_USER@frizzlife.demo',
  assignedDeviceIds: [],
})
assert.equal(duplicateOutcome.result.code, 'DUPLICATE_EMAIL')

const suspendOutcome = updateUser(state, createdUser.id, {
  accountStatus: 'SUSPENDED',
  assignedDeviceIds: [],
})
assert.equal(suspendOutcome.result.success, true)
state = suspendOutcome.state

const suspendedUser = state.users.find(({ id }) => id === createdUser.id)
assert.equal(suspendedUser.accountStatus, 'SUSPENDED')
assert.deepEqual(suspendedUser.assignedDeviceIds, [])
assert.equal(state.devices.find(({ id }) => id === deviceToMove.id).assignedUserId, null)
assert.equal(getDevicesForUser(state, suspendedUser).length, 0)

const suspendedLogin = authenticateUser(
  state.users,
  suspendedUser.email,
  'Demo1234',
)
assert.equal(suspendedLogin.code, 'ACCOUNT_SUSPENDED')

const filteredSuspended = filterUserItems(
  createUserListItems(state.users, state.devices),
  { query: 'new_user', status: 'SUSPENDED', model: 'ALL' },
)
assert.deepEqual(filteredSuspended.map(({ user }) => user.id), [suspendedUser.id])

const lpg365Users = filterUserItems(
  createUserListItems(state.users, state.devices),
  { query: '', status: 'ALL', model: 'LPG365' },
)
assert.ok(lpg365Users.length > 0)
assert.ok(lpg365Users.every(({ devices }) => devices.some(({ model }) => model === 'LPG365')))

console.log(JSON.stringify({
  result: 'PASS',
  checks: {
    adminExcludedFromUserManagement: true,
    createDemoUserWithFixedRole: true,
    duplicateEmailRejected: true,
    deviceMovedFromPreviousOwner: true,
    bidirectionalAssignmentSynchronized: true,
    deviceUnassignedOnUserUpdate: true,
    suspendedLoginRejected: true,
    suspendedUserHasNoDeviceAccess: true,
    combinedUserFilters: true,
  },
}, null, 2))

