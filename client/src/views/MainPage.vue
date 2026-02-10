<template>
  <nav class="soft-navbar">
    <div class="nav-left">
      <a class="nav-item" @click="$router.push('/main')">Home</a>
    </div>

    <div class="nav-right">
      <a class="nav-item" @click="$router.push(isAdmin ? '/admin' : '/profile')">{{ isAdmin ? 'Admin' : 'Profile' }}</a>
    </div>
  </nav>

  <div class="page-wrapper">
    <div class="page-card">
      <h1 class="title">HOME PAGE</h1>

      <div class="room">
        <!-- LOCAL ROOM -->
        <b-card
          v-if="user && user.language === 'sv'"
          class="room-card"
          body-class="d-flex flex-column align-items-center"
          @click="$router.push('/localroom')">
          <div class="room-text">LOCAL ROOM</div>
          <img
            src="@/assets/Local_logo.png"
            alt="Local Room"
            class="room-icon"/>
        </b-card>

        <!-- GLOBAL ROOM -->
        <b-card
          class="room-card"
          body-class="d-flex flex-column align-items-center"
          @click="$router.push('/globalroom')">
          <div class="room-text">GLOBAL ROOM</div>
          <img
            src="@/assets/Global_logo.png"
            alt="Global Room"
            class="room-icon"/>
        </b-card>
      
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "HomePage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
    
  },
  computed: {
    isAdmin() {
      return this.user.userId === "admin";
    }
  }
};
</script>


<style scoped>@import "../styles/MainPage.css";</style>
