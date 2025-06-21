import { defineStore } from 'pinia'
import { retryUntilSuccess } from '~/utils/useRetry'

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchTodosByUser(userId: number, retryDelay = 1000) {
    isLoading.value = true
    error.value = null

    try {
      const data = await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
        if (!res.ok) throw new Error('Ошибка загрузки задач')
        return await res.json()
      }, retryDelay)

      todos.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    todos,
    isLoading,
    error,
    fetchTodosByUser
  }
})
