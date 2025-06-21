<script setup lang="ts">
import autoAnimate from '@formkit/auto-animate'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '~/stores/users'
import { computed, onMounted, reactive, ref } from 'vue'

import UserPosts from '~/components/UserPosts.vue'
import UserTodos from '~/components/UserTodos.vue'

const tab = ref<'posts' | 'todos'>('posts')
const editBlock = ref<HTMLElement | null>(null)
const tabContent = ref<HTMLElement | null>(null)

const activeTabClass = 'font-semibold border-b-2 border-blue-600 pb-1'
const inactiveTabClass = 'text-gray-500 hover:text-blue-600'


const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)

const userStore = useUsersStore()
const isEditing = ref(false)

const user = computed(() => userStore.users?.find(u => u.id === userId))

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
  isEditing.value = false
}

function deleteUser() {
  if (confirm('Are you sure you want to delete this user?')) {
    userStore.deleteUser(userId)
    router.push('/')
  }
}

onMounted(async () => {
  if (!userStore.users) {
    await userStore.fetchUsers()
  }
})
onMounted(() => {
  if (editBlock.value) autoAnimate(editBlock.value)
  if (tabContent.value) autoAnimate(tabContent.value)
})
</script>

<template>
  <div>

    <div class="mt-6 p-6">
      <NuxtLink
        to="/"
        class="text-blue-600 hover:underline"
      >
        ← Back to user catalog
      </NuxtLink>
    </div>

    <div class="p-6 max-w-3xl">
      <div v-if="userStore.isLoading">Loading...</div>
      <div
        v-else-if="userStore.error"
        class="text-red-600"
      >
        Error: {{ userStore.error.message }}
      </div>
      <div v-else-if="!user">
        <p class="text-gray-500">User not found.</p>
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
              class="text-blue-600 hover:underline text-sm"
            >
              ✏️ Edit
            </button>
            <button
              v-if="!isEditing"
              @click="deleteUser"
              class="text-red-600 hover:underline text-sm"
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
                class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                💾 Save
              </button>
              <button
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-300 rounded cursor-pointer"
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
