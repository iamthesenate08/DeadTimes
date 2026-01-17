<template>
  <div
    v-if="noteText"
    class="anonymous-note-overlay"
    role="dialog"
    aria-live="polite"
  >
    <div class="note" :style="noteStyle">
      <p class="note-text">{{ noteText }}</p>
      <button
        v-if="!session.isSpectator"
        type="button"
        class="close"
        aria-label="Clear anonymous note"
        @click="clearNote"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import noteImage from "../assets/reminder.png";

export default {
  computed: {
    ...mapState(["session"]),
    latestNote() {
      const notes = this.session.approvedAnonymousNotes || [];
      return notes.length ? notes[notes.length - 1] : "";
    },
    noteText() {
      if (typeof this.latestNote === "string") {
        return this.latestNote;
      }
      return this.latestNote?.text || "";
    },
    noteStyle() {
      return {
        backgroundImage: `url(${noteImage})`
      };
    }
  },
  methods: {
    clearNote() {
      this.$store.commit("session/clearAnonymousNote");
    }
  }
};
</script>

<style lang="scss" scoped>
.anonymous-note-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 80;
}

.note {
  width: min(70vw, 520px);
  min-height: 320px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 80px 70px 70px;
  box-sizing: border-box;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4));
  pointer-events: auto;
}

.note-text {
  font-family: "Papyrus", "Comic Sans MS", cursive;
  font-size: clamp(18px, 2.4vw, 26px);
  line-height: 1.4;
  color: #1c140c;
  margin: 0;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
}

.close {
  align-self: flex-end;
  margin-top: 24px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 2px solid rgba(0, 0, 0, 0.7);
  background: rgba(255, 255, 255, 0.85);
  font-family: "Papyrus", "Comic Sans MS", cursive;
  font-size: 16px;
  cursor: pointer;
}

.close:hover {
  background: rgba(255, 255, 255, 1);
}
</style>
