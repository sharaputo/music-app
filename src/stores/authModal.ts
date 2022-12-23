import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("modal", () => {
  const isOpen = ref(false);

  const toggleOpen = (): void => {
    isOpen.value = !isOpen.value;
  };

  return { isOpen, toggleOpen };
});
