<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useRouter } from 'vue-router'
import autoAnimate from '@formkit/auto-animate'

import UserCreateModal from '~/components/UserCreateModal.vue'

const userStore = useUsersStore()
const router = useRouter()

const showModal = ref(false)
const cards = ref<HTMLElement | null>(null)

function goToDetails(userId: number) {
  router.push(`/users/${userId}`)
}

function deleteUser(userId: number, event: Event) {
  event.stopPropagation()
  if (confirm('Are you sure you want to delete this user?')) {
    userStore.deleteUser(userId)
  }
}

onMounted(async () => {
  if (!userStore.users?.length) await userStore.fetchUsers()
  if (cards.value) autoAnimate(cards.value)
})
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">User Catalog</h1>
      <button
        class="btn-primary"
        @click="showModal = true"
      >➕ Add</button>
    </div>

    <div v-if="userStore.isLoading">Loading...</div>
    <div
      v-else-if="userStore.error"
      class="text-red-500"
    >
      Error: {{ userStore.error.message }}
    </div>

    <!-- 📱 Mobile Cards -->
    <div
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
    <div class="hidden md:block rounded-lg shadow">
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
              class="text-red-600 hover:underline text-sm"
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