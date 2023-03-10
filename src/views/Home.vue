<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(/assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.title") }}</h1>
          <p class="w-full md:w-8/12 mx-auto">{{ $t("home.description") }}</p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon.right.green="'headphones-alt'"
        >
          <span class="card-title">{{ $t("home.subtitle") }}</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <PlaylistItem
            v-for="track in tracks"
            :key="track.docId"
            :track="track"
          />
        </ol>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import PlaylistItem from "@/components/PlaylistItem.vue";
import { tracksCollection } from "@/includes/firebase";
import type { TrackDetails } from "@/types/TrackDetails";

const tracks = ref<TrackDetails[]>([]);
const pendingRequest = ref(false);
const maxPerPage = 25;

const getTracks = async (): Promise<void> => {
  if (pendingRequest.value) {
    return;
  }
  pendingRequest.value = true;

  let snapshots;
  if (tracks.value.length) {
    const lastDocument = await tracksCollection
      .doc(tracks.value[tracks.value.length - 1].docId)
      .get();
    snapshots = await tracksCollection
      .orderBy("modified_name", "desc")
      .startAfter(lastDocument)
      .limit(maxPerPage)
      .get();
  } else {
    snapshots = await tracksCollection
      .orderBy("modified_name", "desc")
      .limit(maxPerPage)
      .get();
  }

  snapshots.forEach((document) => {
    tracks.value.push({
      ...(document.data() as TrackDetails),
      docId: document.id,
    });
  });

  pendingRequest.value = false;
};
const handleScroll = (): void => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getTracks();
  }
};

onMounted(async () => {
  await getTracks();

  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
