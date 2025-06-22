<script setup lang="ts">
import autoAnimate from '@formkit/auto-animate'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '~/stores/users'
import { onMounted, reactive, ref } from 'vue'
import type { User } from '~/types/user'

import UserPosts from '~/components/UserPosts.vue'
import UserTodos from '~/components/UserTodos.vue'

const user = ref<User | null>(null)
const tab = ref<'posts' | 'todos'>('posts')
const editBlock = ref<HTMLElement | null>(null)
const tabContent = ref<HTMLElement | null>(null)

const activeTabClass = 'font-semibold border-b-2 border-blue-600 pb-1 text-blue-600 hover:text-blue-800'
const inactiveTabClass = 'text-gray-500 hover:text-blue-600 transition duration-300 hover:border-b-2 hover:border-blue-600 pb-1'


const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)

const userStore = useUsersStore()
const isEditing = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  city: '',
  street: '',
  company: '',
  catchPhrase: ''
})

function startEdit() {
  if (!user.value) return
  isEditing.value = true
  form.name = user.value.name
  form.email = user.value.email
  form.phone = user.value.phone
  form.website = user.value.website
  form.city = user.value.address?.city || ''
  form.street = user.value.address?.street || ''
  form.company = user.value.company?.name || ''
  form.catchPhrase = user.value.company?.catchPhrase || ''
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  await userStore.updateUser(userId, {
    name: form.name,
    email: form.email,
    phone: form.phone,
    website: form.website,
    address: {
      city: form.city,
      street: form.street
    },
    company: {
      name: form.company,
      catchPhrase: form.catchPhrase
    }
  })
  
  user.value = userStore.users.find(u => u.id === userId) || null
  
  isEditing.value = false
}

function deleteUser() {
  if (confirm('Are you sure you want to delete this user?')) {
    userStore.deleteUser(userId)
    router.push('/')
  }
}

onMounted(() => {
  if (tabContent.value) autoAnimate(tabContent.value)
  if (editBlock.value) autoAnimate(editBlock.value)
})

onMounted(async () => {
  if (!userStore.users.length) {
    try {
      await userStore.fetchUsers()
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }
  try {
    user.value = userStore.users.find(u => u.id === userId) || null
  } catch (err) {
    console.error('Failed to load user:', err)
  }
})

</script>

<template>
  <div>
    <div class="mt-6 p-6">
      <NuxtLink
        to="/"
        class="text-blue-600 flex hover:transform hover:-translate-x-1 text-sm font-medium hover:text-blue-800 transition duration-200 active:translate-x-0.5"
      >
        ← Back to user catalog
      </NuxtLink>
    </div>

    <div class="p-6 max-w-3xl">
      <div
        v-if="userStore.isLoading || !user"
        class="flex justify-center py-10"
      >
        <div class="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div
        v-else-if="userStore.error"
        class="text-red-600"
      >
        Error: {{ userStore.error.message }}
      </div>
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold">
            {{ isEditing ? 'Edit User' : user.name }}
          </h1>
          <div class="space-x-2">
            <button
              v-if="!isEditing"
              @click="startEdit"
              class="text-blue-600 text-sm cursor-pointer hover:text-blue-800 transition duration-200 border-1 border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            >
              ✏️ Edit
            </button>
            <button
              v-if="!isEditing"
              @click="deleteUser"
              class="text-red-600 text-sm cursor-pointer hover:text-red-800 transition duration-200 border-1 border-red-600 px-3 py-1 rounded hover:bg-red-50"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        <div
          class="space-y-2 text-gray-700 border border-gray-200 p-4 rounded bg-gray-50 shadow"
          ref="editBlock"
        >
          <div
            v-if="isEditing"
            class="grid gap-3"
          >
            <label>
              <span class="block font-medium">Name:</span>
              <input
                v-model="form.name"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Email:</span>
              <input
                v-model="form.email"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Phone:</span>
              <input
                v-model="form.phone"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Website:</span>
              <input
                v-model="form.website"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">City:</span>
              <input
                v-model="form.city"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Street:</span>
              <input
                v-model="form.street"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Company:</span>
              <input
                v-model="form.company"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <label>
              <span class="block font-medium">Catchphrase:</span>
              <input
                v-model="form.catchPhrase"
                class="w-full border px-3 py-2 rounded"
              />
            </label>
            <div class="flex gap-3 mt-2">
              <button
                @click="saveEdit"
                class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition duration-100 hover:shadow-lg hover:scale-105 transform active:scale-95"
              >
                💾 Save
              </button>
              <button
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition duration-100 hover:shadow-lg hover:scale-105 transform active:scale-95"
              >
                ✖️ Cancel
              </button>
            </div>
          </div>

          <div v-else>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Phone:</strong> {{ user.phone }}</p>
            <p>
              <strong>Website:</strong>
              <a
                :href="`https://${user.website}`"
                target="_blank"
                class="text-blue-600 underline"
              >
                {{ user.website }}
              </a>
            </p>
            <p><strong>City:</strong> {{ user.address?.city }}</p>
            <p><strong>Street:</strong> {{ user.address?.street }}</p>
            <p><strong>Company:</strong> {{ user.company?.name }}</p>
            <p><strong>Catchphrase:</strong> <em>"{{ user.company?.catchPhrase }}"</em></p>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabs -->
    <div class="p-6 mt-10">
      <div class="flex space-x-4 border-b border-gray-300 pb-2 mb-4">
        <button
          :class="tab === 'posts' ? activeTabClass : inactiveTabClass"
          @click="tab = 'posts'"
        >
          📝 Posts
        </button>
        <button
          :class="tab === 'todos' ? activeTabClass : inactiveTabClass"
          @click="tab = 'todos'"
        >
          ✅ Todos
        </button>
      </div>

      <div
        class="space-y-6"
        ref="tabContent"
      >
        <UserPosts
          v-if="tab === 'posts'"
          :userId="userId"
        />
        <UserTodos
          v-if="tab === 'todos'"
          :userId="userId"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>
input {
  /* @apply focus:outline-none focus:ring-2 text-lg focus:border-transparent; */
}
</style>