<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="emit('close')"
      >
        <Transition name="scale-fade">
          <div
            v-show="visible"
            class="bg-white w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl mx-4 md:mx-0"
          >
            <h2 class="text-xl font-semibold">➕ Add New User</h2>
            <div class="space-y-2">
              <input v-model="form.name" placeholder="Name" class="w-full border px-3 py-2 rounded" />
              <input v-model="form.email" placeholder="Email" class="w-full border px-3 py-2 rounded" />
              <input v-model="form.city" placeholder="City" class="w-full border px-3 py-2 rounded" />
              <input v-model="form.company" placeholder="Company" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="flex justify-end gap-2">
              <button @click="onSave" class="px-4 py-2 bg-amber-600 text-white rounded cursor-pointer hover:bg-amber-700 transition duration-100 hover:shadow-lg hover:scale-105 transform active:scale-95">💾 Save</button>
              <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition duration-100 hover:shadow-lg hover:scale-105 transform active:scale-95">✖️ Cancel</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useUsersStore } from '~/stores/users'

const emit = defineEmits(['close'])
const userStore = useUsersStore()

const visible = ref(false)

const form = reactive({
  name: '',
  email: '',
  city: '',
  company: ''
})

async function onSave() {
  if (!form.name || !form.email) {
    alert('Name and Email are required!')
    return
  }

  await userStore.addUser({
    name: form.name,
    email: form.email,
    address: { city: form.city },
    company: { name: form.company }
  })

  emit('close')
}

onMounted(() => {
  visible.value = true
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.2s ease;
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
