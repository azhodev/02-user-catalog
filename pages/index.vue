<script setup lang="ts">
import 'vue-loading-overlay/dist/css/index.css'
import { ref, onMounted } from 'vue'
import { useEventListener, useDebounceFn } from '@vueuse/core'
import { useUsersStore } from '~/stores/users'
import { useRouter } from 'vue-router'
import autoAnimate from '@formkit/auto-animate'
const Loading = defineAsyncComponent(() => import('vue-loading-overlay'))

const UserCreateModal = defineAsyncComponent(() => import('~/components/UserCreateModal.vue'))

const router = useRouter()
const userStore = useUsersStore()
const toast = useAppToast()

const showModal = ref(false)
const cards = ref<HTMLElement | null>(null)

const isMobile = ref(false)

const checkViewport = () => {
  isMobile.value = window.innerWidth < 768
}

const goToDetails = (userId: number) => {
  router.push(`/users/${userId}`)
}

const deleteUser = (userId: number, event: Event) => {
  event.stopPropagation()
  if (confirm('Are you sure you want to delete this user?')) {
    userStore.deleteUser(userId)
  }
}

onMounted(async () => {
  if (!userStore.users?.length) await userStore.fetchUsers(toast)
  if (cards.value) autoAnimate(cards.value)
})

onMounted(() => {
  checkViewport()
})

useEventListener('resize', useDebounceFn(checkViewport, 300))

useHead({
  title: 'User Catalog',
  meta: [
    { name: 'description', content: 'All users.' }
  ]
})
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">User Catalog</h1>
      <button
        class="px-4 py-2 bg-amber-600 text-white rounded cursor-pointer hover:bg-amber-700 transition duration-100 hover:shadow-lg hover:scale-105 transform active:scale-95"
        @click="showModal = true"
      >➕ Add</button>
    </div>

    <!-- 📱 Mobile Cards -->
    <div
      v-if="isMobile"
      class="grid gap-4 md:hidden"
      ref="cards"
    >
      <div
        v-for="user in userStore.users"
        :key="user.id"
        class="p-4 border border-gray-200 rounded shadow cursor-pointer hover:bg-gray-50 transition"
        @click="goToDetails(user.id)"
      >
        <h2 class="text-lg font-semibold">{{ user.name }}</h2>
        <p class="text-sm text-gray-600">{{ user.email }}</p>
        <p class="text-sm text-gray-500">{{ user.address?.city }}</p>
        <p class="text-sm text-gray-500 italic">{{ user.company?.name }}</p>

        <div class="mt-4 flex gap-3 text-sm">
          <button
            class="text-red-600 hover:underline"
            @click="deleteUser(user.id, $event)"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <!-- 💻 Desktop Table -->
    <div
      v-else
      class="hidden md:block rounded-lg shadow"
    >
      <table class="min-w-full table-auto border border-gray-200">
        <thead class="bg-gray-100 text-left border-b border-gray-400">
          <tr>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">City</th>
            <th class="p-3">Company</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tr
          v-for="user in userStore.users"
          :key="user.id"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0 }"
          :leave="{ opacity: 0, y: -10 }"
          class="transition-all duration-300 ease-in-out hover:bg-gray-100 cursor-pointer border-b border-gray-400 last:border-b-0"
          @click="goToDetails(user.id)"
        >
          <td class="p-3 font-medium">{{ user.name }}</td>
          <td class="p-3 text-sm text-gray-600">{{ user.email }}</td>
          <td class="p-3 text-sm">{{ user.address?.city }}</td>
          <td class="p-3 text-sm italic">{{ user.company?.name }}</td>
          <td class="p-3">
            <button
              class="text-red-600 text-sm active:scale-95 transition duration-200 hover:text-red-800 hover:scale-105 border-1 border-red-600 px-3 py-1 rounded hover:bg-red-50 cursor-pointer"
              @click.stop="deleteUser(user.id, $event)"
            >
              🗑️ Delete
            </button>
          </td>
        </tr>
      </table>
    </div>

    <UserCreateModal
      v-if="showModal"
      @close="showModal = false"
    />
    <Loading
      v-if="userStore.isLoading"
      :active="true"
      :can-cancel="false"
    />
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>