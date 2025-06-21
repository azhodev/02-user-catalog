import { defineStore } from 'pinia'

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

  async function fetchTodosByUser(userId: number) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      if (!res.ok) throw new Error('Ошибка загрузки задач')
      const data = await res.json()
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
