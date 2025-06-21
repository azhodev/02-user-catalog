import { defineStore } from 'pinia'
import { retryUntilSuccess } from '~/utils/useRetry'
import type { User } from '~/types/user'


export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const isLoading = ref<Boolean>(false)
  const error = ref<Error | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null

    try {
      const data = await retryUntilSuccess(async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        return await res.json()
      },{
        retryDelay: 1000,
        maxRetries: 5,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      users.value = data
      error.value = null
    } catch (err: any) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function addUser(newUser: Partial<User>) {
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
        maxRetries: 5,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      users.value.push({ ...newUser, id: created.id } as User)
    } catch (err: any) {
      console.error('Failed to add user:', err)
    }
  }

  async function updateUser(id: number, updatedFields: Partial<User>) {
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
        maxRetries: 5,
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
    } catch (err: any) {
      console.error('Failed to update user:', err)
    }
  }

  async function deleteUser(id: number) {
    try {
      await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'DELETE'
        })
        if (!res.ok) throw new Error('Failed to delete user')
      }, {
        retryDelay: 1000,
        maxRetries: 5,
        backoffFactor: 2,
        timeoutMs: 15000
      })

      users.value = users.value.filter(u => u.id !== id)
    } catch (err: any) {
      console.error('Failed to delete user:', err)
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
}, {
  persist: true
})
