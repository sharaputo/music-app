import type { DirectiveBinding } from "vue";

export default {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    let iconClass = `fa fa-${binding.value} text-2xl`;

    if (binding.arg === "full") {
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconClass += " float-right";
    }

    if (binding.modifiers.green) {
      iconClass += " text-green-400";
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
