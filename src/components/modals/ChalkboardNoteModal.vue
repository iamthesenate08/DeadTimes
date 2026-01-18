<template>
  <Modal
    class="chalkboard-note"
    v-if="modals.chalkboardNote && !session.isSpectator"
    @close="handleClose"
  >
    <h3>Set a chalkboard note</h3>
    <p class="subtitle">Share a custom message with the table.</p>
    <textarea
      v-model.trim="note"
      class="chalkboard-note__input"
      rows="4"
      maxlength="140"
      placeholder="Write a short note for the chalkboard..."
    ></textarea>
    <div class="button-row">
      <button class="button" :disabled="!note" @click="submit">
        Post note
      </button>
      <button class="button button-secondary" @click="handleClose">
        Cancel
      </button>
    </div>
  </Modal>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Modal from "./Modal";

export default {
  components: { Modal },
  data() {
    return {
      note: ""
    };
  },
  computed: {
    ...mapState(["modals", "session"])
  },
  methods: {
    submit() {
      if (!this.note) return;
      const payload = {
        id: `host-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .substr(2, 6)}`,
        text: this.note,
        submittedAt: new Date().toISOString()
      };
      this.$store.commit("session/approveAnonymousNote", payload);
      this.note = "";
      this.toggleModal("chalkboardNote");
    },
    handleClose() {
      this.note = "";
      this.toggleModal("chalkboardNote");
    },
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style scoped lang="scss">
h3 {
  margin: 0 40px 6px;
}

.subtitle {
  margin: 0 40px 16px;
  opacity: 0.75;
  text-align: center;
}

.chalkboard-note__input {
  width: min(100%, 520px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  padding: 10px 12px;
  margin: 0 auto 16px;
  display: block;
  resize: vertical;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 10px;
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
</style>
