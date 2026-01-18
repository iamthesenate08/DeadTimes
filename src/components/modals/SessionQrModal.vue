<template>
  <Modal @close="toggleModal('sessionQr')" v-if="modals.sessionQr">
    <div class="qr-modal">
      <h3>Session QR</h3>
      <p class="qr-modal__instruction">
        Players: scan this QR code to join the session.
      </p>
      <div class="qr-modal__code" v-if="qrImageUrl">
        <img :src="qrImageUrl" :alt="`QR for ${joinUrl}`" />
      </div>
      <p v-else class="qr-modal__empty">Start hosting to generate a QR code.</p>
      <p class="qr-modal__link" v-if="joinUrl">
        {{ joinUrl }}
      </p>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal";
import { mapMutations, mapState } from "vuex";
import { getSessionJoinUrl } from "../../utils/session";

export default {
  components: {
    Modal
  },
  computed: {
    ...mapState(["modals"]),
    ...mapState("session", ["sessionId"]),
    joinUrl() {
      return getSessionJoinUrl(this.sessionId);
    },
    qrImageUrl() {
      if (!this.joinUrl) return "";
      const params = new URLSearchParams({
        size: "240x240",
        data: this.joinUrl
      });
      return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    }
  },
  methods: {
    ...mapMutations(["toggleModal"])
  }
};
</script>

<style lang="scss" scoped>
.qr-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 10px 0 20px;

  &__instruction {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  &__code {
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    img {
      display: block;
      width: 240px;
      height: 240px;
    }
  }

  &__empty {
    opacity: 0.7;
    margin: 0;
  }

  &__link {
    max-width: 420px;
    word-break: break-all;
    font-size: 0.9rem;
    opacity: 0.8;
  }
}
</style>
