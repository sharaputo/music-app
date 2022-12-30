import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { formatTime } from "@/includes/helper";
import { Howl } from "howler";
import type { TrackDetails } from "@/types/TrackDetails";

export default defineStore("player", () => {
  const currentTrack = ref<TrackDetails | null>(null);
  const sound = ref<Howl | null>(null);
  const seek = ref("00:00");
  const duration = ref("00:00");
  const progress = ref("0%");

  const isPlaying = computed(() => {
    if (sound.value?.playing) {
      return sound.value.playing();
    }

    return false;
  });

  const newTrack = async (track: TrackDetails): Promise<void> => {
    if (sound.value instanceof Howl) {
      sound.value.unload();
    }

    currentTrack.value = track;

    sound.value = new Howl({
      src: [track.url],
      html5: true,
    });

    sound.value.play();

    sound.value.on("play", () => {
      requestAnimationFrame(updateTime);
    });
  };
  const toggleAudio = async (): Promise<void> => {
    if (!sound.value?.playing) return;

    if (sound.value?.playing()) {
      sound.value.pause();
    } else {
      sound.value?.play();
    }
  };
  const updateTime = (): void => {
    if (sound.value) {
      seek.value = formatTime(sound.value.seek());
      duration.value = formatTime(sound.value.duration());
      progress.value = `${
        (sound.value.seek() / sound.value.duration()) * 100
      }%`;

      if (sound.value.playing()) {
        requestAnimationFrame(updateTime);
      }
    }
  };
  const updateSeek = (event: MouseEvent): void => {
    if (!sound.value?.playing) return;

    const { x, width } = (
      event.currentTarget as Element
    ).getBoundingClientRect();

    const clickX = event.clientX - x;
    const percentage = clickX / width;
    const seconds = sound.value.duration() * percentage;
    sound.value.seek(seconds);
    sound.value.once("seek", updateTime);
    sound.value.play();
  };

  return {
    currentTrack,
    seek,
    duration,
    progress,
    isPlaying,
    newTrack,
    toggleAudio,
    updateSeek,
  };
});
