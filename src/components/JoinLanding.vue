<template>
  <div class="join">
    <h2>Join the Town Square</h2>
    <p>Enter your name to take a seat in this session.</p>
    <form class="join-form" @submit.prevent="submit">
      <input
        v-model.trim="name"
        type="text"
        maxlength="20"
        placeholder="Your name"
        autocomplete="name"
      />
      <button class="button" type="submit" :disabled="!name || isSubmitted">
        {{ isSubmitted ? "Request sent" : "Join game" }}
      </button>
    </form>
    <p v-if="isSubmitted && !isSeated" class="status">
      Waiting for the host to seat you...
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      name: localStorage.getItem("playerName") || "",
      isSubmitted: false
    };
  },
  computed: {
    ...mapState(["session"]),
    ...mapState("players", ["players"]),
    isSeated() {
      return this.players.some(player => player.id === this.session.playerId);
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
      this.$store.commit("session/requestJoin", this.name);
    }
  }
};
</script>

<style scoped lang="scss">
.join {
  text-align: center;
  width: 45%;
  font-size: 120%;
  position: absolute;
  padding: 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid black;
  border-radius: 10px;
  z-index: 3;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
}

.join-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
  input {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #333;
    min-width: 200px;
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
}

.status {
  margin-top: 12px;
  opacity: 0.8;
}
</style>
