<template>
  <TheHeader />

  <RouterView #="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>

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

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s linear;
}
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.5s linear;
}
</style>
