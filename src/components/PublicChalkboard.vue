<template>
  <div class="public-chalkboard">
    <div class="public-chalkboard__frame">
      <img
        class="public-chalkboard__image"
        :src="chalkboardImage"
        alt="Chalkboard"
      />
      <div class="public-chalkboard__overlay">
        <div class="public-chalkboard__names">
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
        <div class="public-chalkboard__notes">
          <p v-if="activeAnonymousNote">
            {{ activeAnonymousNoteText }}
          </p>
          <p v-else class="public-chalkboard__placeholder">
            Anonymous notes will appear here.
          </p>
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
  }
};
</script>

<style scoped lang="scss">
.public-chalkboard {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  z-index: 5;
  background: rgba(0, 0, 0, 0.75);
}

.public-chalkboard__frame {
  position: relative;
  width: 100%;
  max-width: 1100px;
  max-height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.public-chalkboard__image {
  width: 100%;
  height: auto;
  max-height: 95vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

.public-chalkboard__overlay {
  position: absolute;
  inset: 6% 8%;
  display: grid;
  grid-template-columns: minmax(160px, 26%) 1fr;
  gap: 20px;
  align-items: center;
  color: #f7f3e8;
  font-size: clamp(0.9rem, 1.6vw + 0.4rem, 1.25rem);
}

.public-chalkboard__names {
  align-self: stretch;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
  padding-right: 10px;
}

.public-chalkboard__names h3 {
  font-size: 1.3em;
  margin-bottom: 4px;
}

.public-chalkboard__names ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
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

.public-chalkboard__notes {
  text-align: center;
  font-family: "Papyrus", serif;
  font-size: 2.4em;
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
  padding: 10px 20px;
  justify-self: center;
  align-self: center;
  max-width: 90%;
  text-transform: uppercase;
}

.public-chalkboard__placeholder {
  opacity: 0.65;
  font-size: 1.5em;
  text-transform: none;
}

@media screen and (max-width: 768px) {
  .public-chalkboard__overlay {
    grid-template-columns: 1fr;
    align-items: flex-start;
    text-align: center;
  }

  .public-chalkboard__names {
    align-items: center;
    text-align: center;
  }

  .public-chalkboard__notes {
    padding-top: 0;
  }
}
</style>
