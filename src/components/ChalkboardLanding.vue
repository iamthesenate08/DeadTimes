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
          <p>
            You're viewing this session as a spectator. Leave an anonymous note
            for the town.
          </p>
        </div>
        <button
          class="button button-secondary chalkboard__note-button"
          @click="openAnonymousNote"
        >
          Leave an anonymous note
        </button>
        <div class="chalkboard__names">
          <h3>Players</h3>
          <ul>
            <li v-for="player in players" :key="player.id">
              <span class="player-name" :class="{ 'is-dead': player.isDead }">
                {{ player.name }}
              </span>
              <span
                v-if="player.isDead"
                class="ghost-vote"
                :class="{ 'is-used': player.isVoteless }"
              >
                (1 Ghost Vote)
              </span>
            </li>
          </ul>
        </div>
        <div v-if="activeAnonymousNote" class="chalkboard__message">
          {{ activeAnonymousNoteText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      chalkboardImage: "https://i.imgur.com/yfOk8nj.png"
    };
  },
  computed: {
    ...mapState(["session"]),
    ...mapState("players", ["players"]),
    activeAnonymousNote() {
      const { approvedAnonymousNotes, activeAnonymousNoteId } = this.session;
      if (!activeAnonymousNoteId) return null;
      return approvedAnonymousNotes.find(
        note => note.id === activeAnonymousNoteId
      );
    },
    activeAnonymousNoteText() {
      if (!this.activeAnonymousNote) return "";
      return this.activeAnonymousNote.text.toUpperCase();
    }
  },
  methods: {
    openAnonymousNote() {
      this.$store.commit("toggleModal", "anonymousNote");
    }
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
  font-size: clamp(0.9rem, 1.6vw + 0.4rem, 1.2rem);
}

.chalkboard__header h2 {
  font-size: 1.6em;
  margin-bottom: 6px;
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

.chalkboard__note-button {
  align-self: center;
  width: min(80%, 320px);
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
  font-size: 1em;
}

.player-name.is-dead {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

.ghost-vote {
  margin-left: 6px;
  font-size: 0.95em;
}

.ghost-vote.is-used {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
}

.chalkboard__message {
  margin-top: auto;
  font-family: "Papyrus", serif;
  font-size: 2.2em;
  line-height: 1.2;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
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
