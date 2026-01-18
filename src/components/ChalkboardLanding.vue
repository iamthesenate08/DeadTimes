<template>
  <div class="chalkboard">
    <div class="chalkboard__frame">
      <img
        class="chalkboard__image"
        :src="chalkboardImage"
        alt="Chalkboard"
      />
      <div class="chalkboard__overlay">
        <div class="chalkboard__header">
          <h2>Welcome to the Chalkboard</h2>
          <p>Sign in to take a seat in this session.</p>
        </div>
        <form class="chalkboard__form" @submit.prevent="submit">
          <input
            v-model.trim="name"
            type="text"
            maxlength="20"
            placeholder="Your name"
            autocomplete="name"
          />
          <div class="chalkboard__actions">
            <button
              class="button"
              type="submit"
              :disabled="!name || isSubmitted"
            >
              {{ isSubmitted ? "Request sent" : "Join game" }}
            </button>
            <button
              class="button button-secondary"
              type="button"
              @click="spectate"
            >
              Spectate instead
            </button>
          </div>
        </form>
        <p v-if="isSubmitted && !isSeated" class="chalkboard__status">
          Waiting for the host to seat you...
        </p>
        <div v-if="!isNoteDismissed" class="chalkboard__note">
          <p>Leave an anonymous note for the storyteller?</p>
          <div class="chalkboard__note-actions">
            <button class="button button-secondary" @click="openNoteModal">
              Leave a note
            </button>
            <button class="button button-secondary" @click="dismissNote">
              Not now
            </button>
          </div>
        </div>
        <div class="chalkboard__names">
          <h3>Players</h3>
          <ul>
            <li v-for="player in players" :key="player.id">
              {{ player.name }}
            </li>
          </ul>
        </div>
        <div v-if="activeAnonymousNote" class="chalkboard__message">
          {{ activeAnonymousNote.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      name: localStorage.getItem("playerName") || "",
      isSubmitted: false,
      isNoteDismissed: false,
      chalkboardImage: "https://i.imgur.com/AKGaolT.png"
    };
  },
  computed: {
    ...mapState(["session"]),
    ...mapState("players", ["players"]),
    isSeated() {
      return this.players.some(player => player.id === this.session.playerId);
    },
    activeAnonymousNote() {
      const { approvedAnonymousNotes, activeAnonymousNoteId } = this.session;
      if (!activeAnonymousNoteId) return null;
      return approvedAnonymousNotes.find(
        note => note.id === activeAnonymousNoteId
      );
    }
  },
  watch: {
    isSeated(value) {
      if (value) {
        this.isSubmitted = false;
      }
    }
  },
  methods: {
    submit() {
      if (!this.name) return;
      localStorage.setItem("playerName", this.name);
      this.isSubmitted = true;
      this.$store.commit("session/setHasDeclinedSeat", false);
      this.$store.commit("session/requestJoin", this.name);
    },
    spectate() {
      this.isSubmitted = false;
      this.$store.commit("session/setHasDeclinedSeat", true);
    },
    openNoteModal() {
      this.toggleModal("anonymousNote");
    },
    dismissNote() {
      this.isNoteDismissed = true;
    },
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style scoped lang="scss">
.chalkboard {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  z-index: 5;
  background: rgba(0, 0, 0, 0.65);
}

.chalkboard__frame {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chalkboard__image {
  width: 100%;
  height: auto;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

.chalkboard__overlay {
  position: absolute;
  inset: 7% 10%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #f7f3e8;
  text-align: center;
  font-size: clamp(0.9rem, 2.4vw, 1.1rem);
}

.chalkboard__header h2 {
  font-size: clamp(1.3rem, 3.5vw, 2rem);
  margin-bottom: 6px;
}

.chalkboard__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.chalkboard__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(80%, 320px);
}

input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  width: min(80%, 320px);
}

.button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #222;
  background: #222;
  color: white;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-secondary {
  background: #3a3a3a;
  border-color: #2a2a2a;
}

.chalkboard__status {
  opacity: 0.85;
}

.chalkboard__note {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.chalkboard__note-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.chalkboard__note-actions .button {
  min-width: 120px;
}

.chalkboard__names {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  max-height: 30vh;
  overflow: hidden;
}

.chalkboard__names ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 16px;
  width: 100%;
  padding: 0 8px;
}

.chalkboard__names li {
  font-size: clamp(0.85rem, 2.2vw, 1.05rem);
}

.chalkboard__message {
  margin-top: auto;
  font-family: "Papyrus", serif;
  font-size: clamp(1.4rem, 4.5vw, 2.6rem);
  line-height: 1.2;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
}

@media screen and (max-width: 480px) {
  .chalkboard__overlay {
    inset: 8% 7%;
  }

  .chalkboard__names ul {
    grid-template-columns: 1fr;
  }
}
</style>
