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
              {{ player.name }}
            </li>
          </ul>
        </div>
        <div class="public-chalkboard__notes">
          <p v-if="activeAnonymousNote">
            {{ activeAnonymousNote.text }}
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
      chalkboardImage: "https://i.imgur.com/AKGaolT.png"
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
  font-size: clamp(0.9rem, 2.4vw, 1.2rem);
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
  font-size: clamp(1rem, 2.8vw, 1.4rem);
  margin-bottom: 4px;
}

.public-chalkboard__names ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
  font-size: clamp(0.85rem, 2.2vw, 1.1rem);
}

.public-chalkboard__notes {
  text-align: center;
  font-family: "Papyrus", serif;
  font-size: clamp(1.6rem, 4.5vw, 3rem);
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
  padding: 10px 20px;
  justify-self: center;
  align-self: center;
  max-width: 90%;
}

.public-chalkboard__placeholder {
  opacity: 0.65;
  font-size: clamp(1.2rem, 3.5vw, 2rem);
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
