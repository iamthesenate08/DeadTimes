<template>
  <Modal
    class="anonymous-note-queue"
    v-if="modals.anonymousNoteQueue && !session.isSpectator"
    @close="toggleModal('anonymousNoteQueue')"
  >
    <h3>Anonymous note queue</h3>
    <p class="empty" v-if="!anonymousNotes.length">
      No anonymous notes are waiting for review.
    </p>
    <ul v-else class="note-list">
      <li v-for="note in anonymousNotes" :key="note.id" class="note">
        <div class="note-body">
          <p>{{ note.text }}</p>
          <small>Submitted {{ formatTimestamp(note.createdAt) }}</small>
        </div>
        <div class="button-group">
          <div class="button townsfolk" @click="approve(note.id)">
            Approve
          </div>
          <div class="button demon" @click="reject(note.id)">
            Reject
          </div>
        </div>
      </li>
    </ul>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";

export default {
  components: { Modal },
  computed: {
    ...mapState(["modals", "session"]),
    anonymousNotes() {
      return this.session.anonymousNotes || [];
    }
  },
  methods: {
    approve(id) {
      this.$store.commit("session/approveAnonymousNote", id);
    },
    reject(id) {
      this.$store.commit("session/rejectAnonymousNote", id);
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "just now";
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return "just now";
      return date.toLocaleString();
    },
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style scoped lang="scss">
@import "../../vars.scss";

h3 {
  margin: 0 40px 10px;
}

.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 50vh;
  overflow-y: auto;
}

.note {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-body {
  text-align: left;
  p {
    margin: 0 0 4px;
    white-space: pre-wrap;
  }
  small {
    opacity: 0.8;
  }
}

.empty {
  margin: 15px 0;
  text-align: center;
}
</style>
