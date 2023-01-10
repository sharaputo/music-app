<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <RouterLink
        to="/"
        class="text-white font-bold text-2xl mr-4"
        active-class="no-active"
      >
        Musiq Oasis
      </RouterLink>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="modalStore.toggleOpen"
            >
              {{ $t("header.login") }}
            </a>
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'manage' }" class="px-2 text-white">
                {{ $t("header.manage") }}
              </RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">
                {{ $t("header.logout") }}
              </a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useModalStore from "@/stores/authModal";
import useUserStore from "@/stores/user";
import { useI18n } from "vue-i18n";
import { setLocale } from "@vee-validate/i18n";

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

const { locale } = useI18n();
const currentLocale = computed(() => {
  return locale.value === "en" ? "Русский" : "English";
});
const changeLocale = (): void => {
  locale.value = locale.value === "ru" ? "en" : "ru";
  setLocale(locale.value);
};
</script>
