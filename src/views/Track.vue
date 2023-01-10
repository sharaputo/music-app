<template>
  <main>
    <!-- Music header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="playerStore.newTrack(track as TrackDetails)"
        >
          <i class="fas" :class="isPlaying"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ track?.modified_name }}</div>
          <div>{{ track?.genre }}</div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">
            {{ $t("track.comment_count") }} ({{ track?.comment_count }})
          </span>
          <span v-icon.right.green="'comments'"></span>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 rounded mb-4"
            :class="comment_alert_variant"
            v-if="comment_show_alert"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userStore.userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              :placeholder="$t('track.comment_placeholder')"
            ></vee-field>
            <div class="mb-4">
              <ErrorMessage class="text-red-600" name="comment" />
            </div>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600"
              :disabled="comment_in_submission"
            >
              {{ $t("track.submit") }}
            </button>
          </vee-form>
          <!-- Comments sorting -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">{{ $t("track.latest") }}</option>
            <option value="2">{{ $t("track.oldest") }}</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docId"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold first-letter:uppercase">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";
import { useI18n } from "vue-i18n";
import {
  auth,
  tracksCollection,
  commentsCollection,
} from "@/includes/firebase";
import type { TrackDetails } from "@/types/TrackDetails";

interface Comment {
  content: string;
  datePosted: string;
  tid: string | string[];
  name: string | null | undefined;
  uid: string | undefined;
  docId?: string;
}

const userStore = useUserStore();
const playerStore = usePlayerStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const track = ref<TrackDetails | null>(null);
const comments = ref<Comment[]>([]);
const schema = ref({
  comment: "min:3",
});

const isPlaying = computed(() => {
  return playerStore.isPlaying ? "fa-pause" : "fa-play";
});

const sort = ref("1");
const sortedComments = computed(() => {
  return comments.value.slice().sort((a, b) => {
    if (sort.value === "1") {
      return (
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
    }
    return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
  });
});

watch(sort, (newVal) => {
  if (newVal === route.query.sort) return;

  router.push({ query: { sort: newVal } });
});

const comment_in_submission = ref(false);
const comment_show_alert = ref(false);
const comment_alert_variant = ref("bg-blue-500");
const comment_alert_message = ref(t("track.message_general"));
const addComment = async (
  value: any,
  { resetForm }: { resetForm: () => void }
): Promise<void> => {
  comment_in_submission.value = true;
  comment_show_alert.value = true;
  comment_alert_variant.value = "bg-blue-500";
  comment_alert_message.value = t("track.message_general");

  const comment: Comment = {
    content: value.comment,
    datePosted: new Date().toString(),
    tid: route.params.id,
    name: auth.currentUser?.displayName,
    uid: auth.currentUser?.uid,
  };

  try {
    await commentsCollection.add(comment);

    if (!track.value) return;

    track.value.comment_count += 1;

    await tracksCollection.doc(route.params.id as string).update({
      comment_count: track.value?.comment_count,
    });
  } catch (error) {
    comment_in_submission.value = false;
    comment_alert_variant.value = "bg-red-500";
    comment_alert_message.value = t("track.message_error");
    return;
  }

  getComments();

  comment_in_submission.value = false;
  comment_alert_variant.value = "bg-green-500";
  comment_alert_message.value = t("track.message_success");
  resetForm();
};
const getComments = async (): Promise<void> => {
  const commentsSnapshot = await commentsCollection
    .where("tid", "==", route.params.id)
    .get();

  comments.value = [];

  commentsSnapshot.forEach((doc) => {
    comments.value.push({ ...doc.data(), docId: doc.id } as Comment);
  });
};

onMounted(async () => {
  const docSnapshot = await tracksCollection
    .doc(route.params.id as string)
    .get();

  if (!docSnapshot.exists) {
    router.push({ name: "home" });
    return;
  }

  const query = route.query.sort as string;
  sort.value = query === "1" || query === "2" ? query : "1";

  track.value = docSnapshot.data() as TrackDetails;
  getComments();
});
</script>
