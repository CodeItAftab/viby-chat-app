class AudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentSetPlaying: ((playing: boolean) => void) | null = null;

  playAudio(audio: HTMLAudioElement, setPlaying: (playing: boolean) => void) {
    // Stop current audio if playing
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentSetPlaying) {
        this.currentSetPlaying(false);
      }
    }

    // Set new current audio
    this.currentAudio = audio;
    this.currentSetPlaying = setPlaying;
  }

  stopAudio(audio: HTMLAudioElement) {
    if (this.currentAudio === audio) {
      this.currentAudio = null;
      this.currentSetPlaying = null;
    }
  }

  pauseAudio(audio: HTMLAudioElement) {
    if (this.currentAudio === audio) {
      // Keep the reference but don't clear it on pause
      // This allows resuming the same audio
    }
  }
}

export const audioManager = new AudioManager();
