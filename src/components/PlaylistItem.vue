<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink
        :to="{ name: 'track', params: { id: track.docId } }"
        class="font-bold block text-gray-600"
      >
        {{ track.modified_name }}
      </RouterLink>
      <p class="text-gray-500 text-sm first-letter:uppercase">
        {{ track.display_name }}
      </p>
    </div>

    <div class="text-gray-600 text-lg">
      <RouterLink
        :to="{ name: 'track', params: { id: track.docId }, hash: '#comments' }"
        custom
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          {{ track.comment_count }}
          <span v-icon:full="'fa fa-comments text-gray-600'"></span>
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { TrackDetails } from "@/types/TrackDetails";

defineProps<{
  track: TrackDetails;
}>();
</script>
