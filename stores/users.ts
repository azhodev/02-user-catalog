import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address?: {
    city?: string
    street?: string
  }
  company?: {
    name?: string
    catchPhrase?: string
  }
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Получить всех пользователей
  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!res.ok) throw new Error('Ошибка загрузки пользователей')
      const data = await res.json()
      users.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  // Добавление пользователя (POST)
  async function addUser(newUser: Partial<User>) {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      const created = await res.json()
      // JSONPlaceholder возвращает объект с id = 11+
      users.value.push({ ...newUser, id: created.id } as User)
    } catch (err: any) {
      console.error('Ошибка при добавлении пользователя:', err)
    }
  }

  // Обновление пользователя (PUT или PATCH)
  async function updateUser(id: number, updatedFields: Partial<User>) {
    console.log('Обновление пользователя:', id, updatedFields);
    
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PATCH', // Можно заменить на PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      })
      const updated = await res.json()
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value.splice(index, 1, {
          ...users.value[index],
          ...updatedFields
        })
      }
    } catch (err: any) {
      console.error('Ошибка при обновлении пользователя:', err)
    }
  }

  // Удаление пользователя (DELETE)
  async function deleteUser(id: number) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE'
      })
      users.value = users.value.filter(u => u.id !== id)
    } catch (err: any) {
      console.error('Ошибка при удалении пользователя:', err)
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  }
})
