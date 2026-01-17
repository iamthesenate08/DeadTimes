<template>
  <Modal
    class="anonymous-note"
    v-if="modals.anonymousNote"
    @close="close"
  >
    <h3>Submit an anonymous note</h3>
    <textarea
      v-model="note"
      :maxlength="maxLength"
      placeholder="Share a quick note for the storyteller..."
    ></textarea>
    <div class="note-meta">
      <span>{{ note.length }} / {{ maxLength }}</span>
    </div>
    <div class="button-group">
      <div class="button demon" @click="close">Cancel</div>
      <div
        class="button townsfolk"
        :class="{ disabled: !canSubmit }"
        @click="submit"
      >
        Submit
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export default {
  components: { Modal },
  data() {
    return {
      note: "",
      maxLength: 280
    };
  },
  computed: {
    ...mapState(["modals"]),
    canSubmit() {
      return this.note.trim().length > 0 && this.note.length <= this.maxLength;
    }
  },
  methods: {
    submit() {
      if (!this.canSubmit) return;
      const payload = {
        id: generateId(),
        text: this.note.trim(),
        createdAt: Date.now()
      };
      this.$store.commit("session/submitAnonymousNote", payload);
      this.close();
    },
    close() {
      this.note = "";
      this.toggleModal("anonymousNote");
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

textarea {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 60vw;
  height: 20vh;
  max-width: 100%;
  resize: vertical;
  padding: 10px;
}

.note-meta {
  display: flex;
  justify-content: flex-end;
  font-size: 80%;
  opacity: 0.8;
  margin-top: 4px;
}
</style>
