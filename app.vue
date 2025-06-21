<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { onMounted } from 'vue'
import { useUsersStore } from '~/stores/users'

const userStore = useUsersStore()
onMounted(async () => {
  if (!userStore.users?.length) await userStore.fetchUsers()
})
</script>

<template>
  <div class="container mx-auto rounded-2xl">
    <NuxtPage />
    <Loading v-if="userStore.isLoading" :active="true" :can-cancel="false" />
  </div>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>