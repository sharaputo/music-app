<template>
  <!-- Player -->
  <div
    class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16"
  >
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="playerStore.toggleAudio">
          <i class="fa text-gray-500 text-xl" :class="isPlaying"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div
        class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1"
      >
        <span class="player-currenttime">{{ playerStore.seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
          v-if="playerStore.currentTrack?.modified_name"
        >
          <span class="song-title font-bold">
            {{ playerStore.currentTrack?.modified_name }}
          </span>
          by
          <span class="song-artist">
            {{ playerStore.currentTrack?.display_name }}
          </span>
        </div>
        <span
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
          @click.prevent="playerStore.updateSeek"
        >
          <span
            class="absolute -top-2.5 text-gray-800 text-lg"
            :style="{ left: playerStore.progress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerStore.progress }"
          ></span>
        </span>
      </div>
      <!-- Duration -->
      <div
        class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1"
      >
        <span class="player-duration">{{ playerStore.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import usePlayerStore from "@/stores/player";

const playerStore = usePlayerStore();

const isPlaying = computed(() => {
  return playerStore.isPlaying ? "fa-pause" : "fa-play";
});
</script>
