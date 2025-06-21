<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodosStore } from '~/stores/todos'
import autoAnimate from '@formkit/auto-animate'
const parent = ref<HTMLElement | null>(null)

const props = defineProps<{ userId: number }>()
const todosStore = useTodosStore()

onMounted(() => {
  todosStore.fetchTodosByUser(props.userId)
  if (parent.value) autoAnimate(parent.value)
})
</script>

<template>
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-xl font-semibold mb-2">Todos</h2>

    <div v-if="todosStore.isLoading" class="text-gray-500">Loading todos...</div>
    <div v-else-if="todosStore.error" class="text-red-600">
      Error: {{ todosStore.error.message }}
    </div>
    <div v-else>
      <div v-if="todosStore.todos.length">
        <ul class="space-y-2" ref="parent">
          <li
            v-for="todo in todosStore.todos"
            :key="todo.id"
            class="flex items-center gap-2"
          >
            <input type="checkbox" :checked="todo.completed" disabled />
            <span :class="todo.completed ? 'line-through text-gray-500' : ''">
              {{ todo.title }}
            </span>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-500">No todos found.</div>
    </div>
  </div>
</template>
