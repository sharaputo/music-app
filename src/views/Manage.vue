<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadForm :addTrack="addTrack" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Tracks</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <TrackItem
              v-for="(track, i) in tracks"
              :key="track.docId"
              :track="track"
              :updateTrack="updateTrack"
              :deleteTrack="deleteTrack"
              :updateUnsavedFlag="updateUnsavedFlag"
              :index="i"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import UploadForm from "@/components/UploadForm.vue";
import TrackItem from "@/components/TrackItem.vue";
import { auth, tracksCollection } from "@/includes/firebase";
import type TrackDetails from "@/types/TrackDetails";

const tracks = ref<TrackDetails[]>([]);
const unsavedFlag = ref(false);

const addTrack = (doc: any): void => {
  tracks.value.push({ ...doc.data(), docId: doc.id } as TrackDetails);
};
const updateTrack = (index: number, data: TrackDetails): void => {
  tracks.value[index].modified_name = data.modified_name;
  tracks.value[index].genre = data.genre;
};
const deleteTrack = (index: number): void => {
  tracks.value.splice(index, 1);
};
const updateUnsavedFlag = (value: boolean): void => {
  unsavedFlag.value = value;
};

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = confirm(
      "Do you really want to leave? You have unsaved changes!"
    );
    next(leave);
  }
});

onMounted(async () => {
  const snapshot = await tracksCollection
    .where("uid", "==", auth.currentUser?.uid)
    .get();

  snapshot.forEach(addTrack);
});
</script>
