<template>
  <TheHeader />

  <main>
    <RouterView />
  </main>

  <MusicPlayer />

  <AuthModal />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import AuthModal from "@/components/AuthModal.vue";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";

const userStore = useUserStore();

onMounted(() => {
  if (auth.currentUser) {
    userStore.setLoginState();
  }
});
</script>
