<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" v-show="modalStore.isOpen">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 transition-opacity"
        @click="modalStore.toggleOpen"
      >
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">
        &#8203;
      </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <!-- Modal header + close button -->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <button
              type="button"
              class="modal-close cursor-pointer z-50"
              @click="modalStore.toggleOpen"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Tabs to switch login/register -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                :class="loginClasses"
                href="#"
                @click.prevent="activeTab = 'login'"
              >
                Login
              </a>
            </li>
            <li class="flex-auto text-center">
              <a
                :class="registerClasses"
                href="#"
                @click.prevent="activeTab = 'register'"
              >
                Register
              </a>
            </li>
          </ul>

          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import useModalStore from "@/stores/authModal";

const modalStore = useModalStore();

const activeTab = ref("login");
const loginClasses = computed(() => {
  return activeTab.value === "login"
    ? "block rounded py-3 px-4 transition hover:text-white text-white bg-blue-600"
    : "block rounded py-3 px-4 transition hover:text-blue-600";
});
const registerClasses = computed(() => {
  return activeTab.value === "register"
    ? "block rounded py-3 px-4 transition hover:text-white text-white bg-blue-600"
    : "block rounded py-3 px-4 transition hover:text-blue-600";
});
</script>
