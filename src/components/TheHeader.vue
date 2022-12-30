<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <RouterLink
        to="/"
        class="text-white font-bold uppercase text-2xl mr-4"
        active-class="no-active"
      >
        Music
      </RouterLink>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="modalStore.toggleOpen"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'manage' }" class="px-2 text-white">
                Manage
              </RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">
                Logout
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import useModalStore from "@/stores/authModal";
import useUserStore from "@/stores/user";

const modalStore = useModalStore();

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const logout = (): void => {
  userStore.signout();

  if (route.meta.needsAuth) {
    router.push({ name: "home" });
  }
};
</script>
