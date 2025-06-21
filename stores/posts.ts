import { defineStore } from 'pinia'
import { retryUntilSuccess } from '~/utils/useRetry'

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchPostsByUser(userId: number, retryDelay = 1000) {
    isLoading.value = true
    error.value = null

    try {
      const data = await retryUntilSuccess(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        if (!res.ok) throw new Error('Ошибка загрузки постов')
        return await res.json()
      }, retryDelay)

      posts.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    isLoading,
    error,
    fetchPostsByUser
  }
})
