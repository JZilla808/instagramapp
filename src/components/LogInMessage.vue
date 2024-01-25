<template>
  <div class="timeline-container">
    <h2>Hi there! Please log in to see posts from subscribed users</h2>
    <br />
    <h3>Or try it out using:</h3>
    <AButton type="default" @click="guestLogin">Guest Login</AButton>
  </div>
</template>

<script>
import { useUserStore } from "../stores/users";

export default {
  setup() {
    const userStore = useUserStore();

    const guestLogin = async () => {
      await userStore.guestLogin();
    };

    return {
      guestLogin,
    };
  },
};
</script>
