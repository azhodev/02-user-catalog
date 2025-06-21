<script setup lang="ts">
import { onMounted } from 'vue'
import { usePostsStore } from '~/stores/posts'
import autoAnimate from '@formkit/auto-animate';

const parent = ref<HTMLElement | null>(null)

const props = defineProps<{ userId: number }>()
const postsStore = usePostsStore()

onMounted(() => {
  postsStore.fetchPostsByUser(props.userId)
  if (parent.value) autoAnimate(parent.value)
})
</script>

<template>
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-xl font-semibold mb-2">Posts</h2>

    <div v-if="postsStore.isLoading" class="text-gray-500">Loading posts...</div>
    <div v-else-if="postsStore.error" class="text-red-600">
      Error: {{ postsStore.error.message }}
    </div>
    <div v-else>
      <div v-if="postsStore.posts.length">
        <ul class="space-y-3" ref="parent">
          <li v-for="post in postsStore.posts" :key="post.id" class="border border-gray-400 p-3 rounded">
            <h3 class="font-bold">{{ post.title }}</h3>
            <p class="text-sm text-gray-700 mt-1">{{ post.body }}</p>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">No posts found.</div>
    </div>
  </div>
</template>
