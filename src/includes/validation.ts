import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import type { App } from "vue";

export default {
  install(app: App) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);

    configure({
      generateMessage: localize({
        en: {
          messages: {
            required: "This field is required",
            tos: "You must accept the Terms of Service",
            min: "The field is too short.",
            max: "The field is too long.",
            alpha_spaces:
              "The field may only contain alphabetical characters and spaces.",
            email: "The field must be a valid email",
            min_value: "The field value is too low",
            max_value: "The field value is too high",
            passwords_mismatch: "The passwords do not match",
            excluded: "You are not allowed to use this value for the field",
            country_excluded:
              "Due to restrictions we do not accept users from this location",
          },
        },
        ru: {
          messages: {
            required: "Это поле обязательно для заполнения",
            tos: "Вы должны принять Правила использования сервиса",
            min: "Поле слишком короткое",
            max: "Поле слишком длинное",
            alpha_spaces:
              "Поле может содержать только буквы алфавита и пробелы",
            email: "Поле должно быть действительным адресом электронной почты",
            min_value: "Значение поля слишком низкое",
            max_value: "Значение поля слишком высокое",
            passwords_mismatch: "Пароли не совпадают",
            excluded: "Вам не разрешено использовать это значение для поля",
            country_excluded:
              "Из-за ограничений мы не принимаем пользователей из этой страны",
          },
        },
      }),

      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
