<template>
  <!-- Status of registering user -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="login_alert_variant"
    v-if="login_show_alert"
  >
    {{ login_alert_message }}
  </div>

  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="login_email">
        {{ $t("login.email") }}
      </label>
      <vee-field
        name="email"
        type="email"
        id="login_email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('login.email_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="login_password">
        {{ $t("login.password") }}
      </label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          id="login_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('login.password_placeholder')"
          v-bind="field"
        />
        <div
          class="text-red-600"
          v-for="(error, i) in errors"
          :key="`${error}-${i}`"
        >
          {{ error }}
        </div>
      </vee-field>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      {{ $t("login.login") }}
    </button>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useUserStore from "@/stores/user";
import { useI18n } from "vue-i18n";
import type { UserLogin } from "@/types/UserLogin";

const loginSchema = ref({
  email: "required|min:6|max:100|email",
  password: "required|min:9|max:100|excluded:password",
});

const userStore = useUserStore();
const { t } = useI18n();

const login_in_submission = ref(false);
const login_show_alert = ref(false);
const login_alert_variant = ref("bg-blue-500");
const login_alert_message = ref(t("login.message_general"));

const login = async (values: UserLogin): Promise<void> => {
  login_in_submission.value = true;
  login_show_alert.value = true;
  login_alert_variant.value = "bg-blue-500";
  login_alert_message.value = t("login.message_general");

  try {
    await userStore.authenticate(values);
  } catch (error) {
    login_in_submission.value = false;
    login_alert_variant.value = "bg-red-500";
    login_alert_message.value = t("login.message_error");
    return;
  }

  login_in_submission.value = false;
  login_alert_variant.value = "bg-green-500";
  login_alert_message.value = t("login.message_success");

  window.location.reload();
};
</script>
