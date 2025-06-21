import { defineStore } from 'pinia'

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

  async function fetchPostsByUser(userId: number) {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      if (!res.ok) throw new Error('Ошибка загрузки постов')
      const data = await res.json()
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
