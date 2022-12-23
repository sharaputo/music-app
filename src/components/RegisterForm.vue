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
        Name
      </label>
      <vee-field
        name="name"
        type="text"
        id="register_name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_email">
        Email
      </label>
      <vee-field
        name="email"
        type="email"
        id="register_email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_age">
        Age
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
        Password
      </label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          id="register_password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
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
        Confirm Password
      </label>
      <vee-field
        name="confirm_password"
        type="password"
        id="register_password_confirm"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2 cursor-pointer" for="register_country">
        Country
      </label>
      <vee-field
        as="select"
        name="country"
        id="register_country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="China">China</option>
        <option value="India">India</option>
        <option value="Russia">Russia</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="NorthKorea">North Korea</option>
        <option value="Iran">Iran</option>
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
      <label class="inline-block cursor-pointer" for="register_checkbox">
        Accept terms of service
      </label>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useUserStore from "@/stores/user";
import type UserRegister from "@/types/UserRegister";

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

const reg_in_submission = ref(false);
const reg_show_alert = ref(false);
const reg_alert_variant = ref("bg-blue-500");
const reg_alert_message = ref("Please, wait! Your account is being created.");

const register = async (values: UserRegister): Promise<void> => {
  reg_in_submission.value = true;
  reg_show_alert.value = true;
  reg_alert_variant.value = "bg-blue-500";
  reg_alert_message.value = "Please, wait! Your account is being created.";

  try {
    await userStore.registerUser(values);
  } catch (error) {
    reg_in_submission.value = false;
    reg_alert_variant.value = "bg-red-500";
    reg_alert_message.value =
      "An unexpected error occured! Please, try again later";
    return;
  }

  reg_alert_variant.value = "bg-green-500";
  reg_alert_message.value = "Success! Your account has been created.";

  window.location.reload();
};
</script>
