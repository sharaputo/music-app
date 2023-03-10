<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!formShown">
      <h4 class="inline-block text-2xl font-bold">{{ track.modified_name }}</h4>
      <button
        type="button"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteTrack"
        v-icon:full="'fa fa-times'"
      ></button>
      <button
        type="button"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="formShown = !formShown"
        v-icon:full="'fa fa-pencil-alt'"
      ></button>
    </div>
    <div v-show="formShown">
      <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        :class="alert_variant"
        v-if="show_alert"
      >
        {{ alert_message }}
      </div>
      <vee-form
        :validation-schema="trackSchema"
        :initial-values="track"
        @submit="editDetails"
      >
        <div class="mb-3">
          <label class="inline-block mb-2" for="track_title">
            {{ $t("manage.track_title") }}
          </label>
          <vee-field
            name="modified_name"
            type="text"
            id="track_title"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.track_title_placeholder')"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2" for="track_genre">
            {{ $t("manage.track_genre") }}
          </label>
          <vee-field
            name="genre"
            type="text"
            id="track_genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('manage.track_genre_placeholder')"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          {{ $t("manage.update") }}
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="formShown = !formShown"
        >
          {{ $t("manage.cancel") }}
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storage, tracksCollection } from "@/includes/firebase";
import { useI18n } from "vue-i18n";
import type { TrackDetails } from "@/types/TrackDetails";

const props = defineProps<{
  track: TrackDetails;
  updateTrack: (index: number, track: TrackDetails) => void;
  deleteTrack: (index: number) => void;
  updateUnsavedFlag: (flag: boolean) => void;
  index: number;
}>();

const formShown = ref(false);

const trackSchema = ref({
  modified_name: "required",
  genre: "alpha_spaces",
});

const { t } = useI18n();
const in_submission = ref(false);
const show_alert = ref(false);
const alert_variant = ref("bg-blue-500");
const alert_message = ref(t("manage.message_general"));

const editDetails = async (data: TrackDetails): Promise<void> => {
  in_submission.value = true;
  show_alert.value = true;
  alert_variant.value = "bg-blue-500";
  alert_message.value = t("manage.message_general");

  try {
    await tracksCollection.doc(props.track.docId).update(data);
  } catch (error) {
    in_submission.value = false;
    alert_variant.value = "bg-red-500";
    alert_message.value = t("manage.message_error");
    return;
  }

  props.updateTrack(props.index, data);
  props.updateUnsavedFlag(false);

  in_submission.value = false;
  alert_variant.value = "bg-green-500";
  alert_message.value = t("manage.message_success");
};
const deleteTrack = async (): Promise<void> => {
  const storageRef = storage.ref();
  const trackRef = storageRef.child(`tracks/${props.track.original_name}`);

  await trackRef.delete();

  await tracksCollection.doc(props.track.docId).delete();

  props.deleteTrack(props.index);
};
</script>
