<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div
      class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
      v-icon.right.green="'upload'"
    >
      <span class="card-title">Upload</span>
    </div>
    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5 class="pointer-events-none">Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <div
        class="mb-4"
        v-for="(upload, i) in uploads"
        :key="`${upload.name}-${i}`"
      >
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { auth, storage, tracksCollection } from "@/includes/firebase";

interface UploadsObject {
  task: any;
  current_progress: number;
  name: string;
  variant: string;
  icon: string;
  text_class: string;
}

const props = defineProps<{
  addTrack: (data: any) => void;
}>();

const is_dragover = ref(false);
const uploads = ref<UploadsObject[]>([]);

const upload = ($event: any): void => {
  is_dragover.value = false;
  const files = $event.dataTransfer
    ? [...$event.dataTransfer.files]
    : [...$event.target.files];

  files.forEach((file) => {
    if (file.type !== "audio/mpeg") return;

    const storageRef = storage.ref();
    const tracksRef = storageRef.child(`tracks/${file.name}`);
    const task = tracksRef.put(file);
    const uploadIndex =
      uploads.value.push({
        task,
        current_progress: 0,
        name: file.name,
        variant: "bg-blue-400",
        icon: "fas fa-spinner fa-spin",
        text_class: "",
      }) - 1;

    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploads.value[uploadIndex].current_progress = progress;
      },
      (error) => {
        uploads.value[uploadIndex].variant = "bg-red-400";
        uploads.value[uploadIndex].icon = "fas fa-times";
        uploads.value[uploadIndex].text_class = "text-red-400";
        console.log(error);
      },
      async () => {
        const track = {
          uid: auth.currentUser?.uid,
          display_name: auth.currentUser?.displayName,
          original_name: task.snapshot.ref.name,
          modified_name: task.snapshot.ref.name,
          genre: "",
          comment_count: 0,
          url: await task.snapshot.ref.getDownloadURL(),
        };

        const trackRef = await tracksCollection.add(track);
        const trackSnapshot = await trackRef.get();

        props.addTrack(trackSnapshot);

        uploads.value[uploadIndex].variant = "bg-green-400";
        uploads.value[uploadIndex].icon = "fas fa-check";
        uploads.value[uploadIndex].text_class = "text-green-400";
      }
    );
  });
};

onUnmounted(() => {
  uploads.value.forEach((upload) => {
    upload.task.cancel();
  });
});
</script>
