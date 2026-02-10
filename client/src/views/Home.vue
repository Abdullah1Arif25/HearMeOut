<template>
  <!-- Navbar -->
  <nav class="soft-navbar">
    <div class="nav-left">
      <a class="nav-item" @click="$router.push('/')">Home</a>
    </div>

    <div class="nav-right">
      <a class="nav-item" @click="$router.push('/AdminLogin')">Admin</a>
    </div>
  </nav>

  <div class="home-wrapper">
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-10 col-lg-8 mx-auto">
        <div class="content-box">
        
          <!-- logo -->
          <img 
            class="logo" 
            src="@/assets/HMO_logo.png"
            alt="App Logo"
          />
        
          <!-- Titles -->
          <h1 class="main-title">Hear Me Out</h1>
          <h2 class="subtitle">We Listen & We Don't Judge</h2>
        
          <!-- Buttons -->
          <div class="button-group">
            <button class="btn-custom" @click="goRegister">Register</button>
            <button class="btn-custom" @click="goLogin">Login</button>
          </div>
        
        </div>
      
        <footer class="footer">© 2025 Hear Me Out — We Listen & We Don't Judge</footer>
      
      </div>
      </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goRegister() {
      this.$router.push("/register");
    },
    goLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style src="@/styles/Home.css"></style>