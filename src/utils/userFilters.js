export const DEFAULT_USER_FILTERS = Object.freeze({
  query: '',
  status: 'ALL',
  model: 'ALL',
})

export function createUserListItems(users, devices) {
  return users
    .filter(({ role }) => role === 'USER')
    .map((user) => ({
      user: {
        ...user,
        accountStatus: user.accountStatus ?? 'ACTIVE',
      },
      devices: devices.filter(({ assignedUserId }) => assignedUserId === user.id),
    }))
}

export function filterUserItems(items, filters) {
  const query = filters.query.trim().toLowerCase()

  return items.filter(({ user, devices }) => {
    const matchesQuery = !query || [user.name, user.email]
      .some((value) => value.toLowerCase().includes(query))
    const matchesStatus = filters.status === 'ALL'
      || user.accountStatus === filters.status
    const matchesModel = filters.model === 'ALL'
      || devices.some(({ model }) => model === filters.model)

    return matchesQuery && matchesStatus && matchesModel
  })
}

