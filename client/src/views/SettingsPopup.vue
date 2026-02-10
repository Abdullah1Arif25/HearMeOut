<template>
  <div class="settings">
    <div class="card">
      <h2>Settings</h2>

      <b-button @click="main">Main Page</b-button>
      <b-button @click="logout">Log out</b-button>
      <b-button @click="cancel">Cancel</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsPopup",

  methods: {
    main() {
      this.$router.push("/main");
    },
    logout() {
      this.$router.push("/");
    },
    cancel() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>@import "../styles/NavigatePage.css";</style>
