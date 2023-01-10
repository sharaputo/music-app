<template>
  <!-- Status of registering user -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    :class="reg_alert_variant"
    v-if="reg_show_alert"
  >
    {{ reg_alert_message }}
  </div>

  <vee-form
    :validation-schema="schema"
    :initial-values="userData"
    @submit="register"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_name">
        {{ $t("register.name") }}
      </label>
      <vee-field
        name="name"
        type="text"
        id="register_name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.name_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_email">
        {{ $t("register.email") }}
      </label>
      <vee-field
        name="email"
        type="email"
        id="register_email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.email_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_age">
        {{ $t("register.age") }}
      </label>
      <vee-field
        name="age"
        type="number"
        id="register_age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_password">
        {{ $t("register.password") }}
      </label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          id="register_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('register.password_placeholder')"
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
    <!-- Confirm Password -->
    <div class="mb-3">
      <label
        class="inline-block mb-2 cursor-pointer"
        for="register_password_confirm"
      >
        {{ $t("register.password_confirm") }}
      </label>
      <vee-field
        name="confirm_password"
        type="password"
        id="register_password_confirm"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('register.password_confirm_placeholder')"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_country">
        {{ $t("register.country") }}
      </label>
      <vee-field
        as="select"
        name="country"
        id="register_country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">{{ $t("register.country_usa") }}</option>
        <option value="China">{{ $t("register.country_china") }}</option>
        <option value="India">{{ $t("register.country_india") }}</option>
        <option value="Russia">{{ $t("register.country_russia") }}</option>
        <option value="Mexico">{{ $t("register.country_mexico") }}</option>
        <option value="Germany">{{ $t("register.country_germany") }}</option>
        <option value="NorthKorea">{{ $t("register.country_nkorea") }}</option>
        <option value="Iran">{{ $t("register.country_iran") }}</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        type="checkbox"
        id="register_checkbox"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t
        tag="label"
        for="register_checkbox"
        class="inline-block cursor-pointer"
        keypath="register.accept"
      >
        <a href="#!">{{ $t("register.tos") }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      {{ $t("register.register") }}
    </button>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useUserStore from "@/stores/user";
import { useI18n } from "vue-i18n";
import type { UserRegister } from "@/types/UserRegister";

const schema = ref({
  name: "required|min:3|max:50|alpha_spaces",
  email: "required|min:6|max:100|email",
  age: "required|min_value:7|max_value:120",
  password: "required|min:9|max:100|excluded:password",
  confirm_password: "passwords_mismatch:@password",
  country: "required|country_excluded:NorthKorea,Iran",
  tos: "tos",
});
const userData = ref({
  country: "USA",
});

const userStore = useUserStore();
const { t } = useI18n();

const reg_in_submission = ref(false);
const reg_show_alert = ref(false);
const reg_alert_variant = ref("bg-blue-500");
const reg_alert_message = ref(t("register.message_general"));

const register = async (values: UserRegister): Promise<void> => {
  reg_in_submission.value = true;
  reg_show_alert.value = true;
  reg_alert_variant.value = "bg-blue-500";
  reg_alert_message.value = t("register.message_general");

  try {
    await userStore.registerUser(values);
  } catch (error) {
    reg_in_submission.value = false;
    reg_alert_variant.value = "bg-red-500";
    reg_alert_message.value = t("register.message_error");
    return;
  }

  reg_in_submission.value = false;
  reg_alert_variant.value = "bg-green-500";
  reg_alert_message.value = t("register.message_success");

  window.location.reload();
};
</script>
