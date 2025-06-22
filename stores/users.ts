import { defineStore } from 'pinia'
import { retryUntilSuccess } from '~/utils/useRetry'
import type { User } from '~/types/user'


export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const isLoading = ref<Boolean>(false)
  const error = ref<Error | null>(null)

  async function fetchUsers(toast?: ReturnType<typeof useAppToast>) {
    isLoading.value = true
    error.value = null

    try {
      const data = await retryUntilSuccess(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        return await res.json()
      }, {
        retryDelay: 1000,
        maxRetries: 5,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      users.value = data
      error.value = null

    } catch (err: any) {
      error.value = err
      toast?.error('Failed to load users')
    } finally {
      isLoading.value = false
    }
  }

  async function addUser(newUser: Partial<User>, toast?: ReturnType<typeof useAppToast>) {
    try {
      const created = await retryUntilSuccess(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })
        if (!res.ok) throw new Error('Failed to create user')
        return await res.json()
      }, {
        retryDelay: 1000,
        maxRetries: 1,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      users.value.push({ ...newUser, id: created.id } as User)

      toast?.success(`User ${created.name} created successfully!`)
    } catch (err: any) {
      console.error('Failed to add user:', err)
      toast?.error('Failed to create user ')
    }
  }


  async function updateUser(id: number, updatedFields: Partial<User>, toast?: ReturnType<typeof useAppToast>) {
    try {
      const updated = await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        })
        if (!res.ok) throw new Error('Failed to update user')
        return await res.json()
      }, {
        retryDelay: 1000,
        maxRetries: 1,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value.splice(index, 1, {
          ...users.value[index],
          ...updatedFields
        })
      }

      toast?.success(`User ${updated.name ?? 'updated'} successfully!`)
    } catch (err: any) {
      console.error('Failed to update user:', err)
      toast?.error('Failed to update user')
    }
  }


  async function deleteUser(id: number, toast?: ReturnType<typeof useAppToast>) {
    try {
      await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'DELETE'
        })
        if (!res.ok) throw new Error('Failed to delete user')
      }, {
        retryDelay: 1000,
        maxRetries: 1,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      const deletedUser = users.value.find(u => u.id === id)
      users.value = users.value.filter(u => u.id !== id)

      toast?.success(`User ${deletedUser?.name ?? 'deleted'} successfully!`)
    } catch (err: any) {
      console.error('Failed to delete user:', err)
      toast?.error('Failed to delete user')
    }
  }


  async function fetchUserById(id: number) {
    try {
      const user = await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        if (!res.ok) throw new Error('Failed to fetch user by ID')
        return await res.json()
      }, {
        retryDelay: 1000,
        maxRetries: 5,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      selectedUser.value = user

      const exists = users.value.some(u => u.id === user.id)
      if (!exists) users.value.push(user)

      return user
    } catch (err: any) {
      console.error(`Failed to fetch user with id=${id}:`, err)
      throw err
    }
  }

  return {
    users,
    isLoading,
    error,
    selectedUser,
    fetchUsers,
    fetchUserById,
    addUser,
    updateUser,
    deleteUser
  }
})
