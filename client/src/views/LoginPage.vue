<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
          <div class="login-card">

        <!-- Header -->
        <h2 class="title">Welcome Back</h2>
        <p class="subtitle">Sign in</p>
  
        <form @submit.prevent="handleLogin" class="form login-form-grid">

        <!-- Inputs -->
          <!-- Toggle between UserID or Personal Number -->
            <div class="login-toggle">
              <span 
                :class="['toggle-option', loginMethod === 'userId' ? 'active' : '']" 
                @click="loginMethod = 'userId'">UserID</span>
            
              <span class="divider">/</span>
            
              <span 
                :class="['toggle-option', loginMethod === 'personalNumber' ? 'active' : '']"
                @click="loginMethod = 'personalNumber'">Personal number</span>
            </div>

            <!-- Dynamic Input -->
          <div class="inputs-row">
            <div class="input-group">
              <label>{{ loginMethod === 'userId' ? 'UserID' : 'Personal Number' }}</label>
              <input 
                :placeholder="loginMethod === 'userId' ? ' ' : ' '" 
                v-model="loginInput"
                type="text"
                required/>
            </div>

  
          <div class="input-group">
            <label>Password</label>
            <input v-model="password" type="password" required />
          </div>
        </div>
          
          <router-link class="forgot-password-link" to="/password">Forgot Password!</router-link>
  
          <button type="submit" class="login-btn">Login</button>
        </form>

        <!-- Error handling -->
        <p v-if="error" class="error">{{ error }}</p>
  
        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
  
        </div>
      </div>
    </div>
  </div>
</div>
  </template>
  
  <script>
  import { Api } from "../Api";
    import { getUserObjectId, setUserObjectId } from "@/cache/user.cache";
  
  export default {
    name: "LoginPage",
  
    data() {
      return {
        loginMethod: "userId", 
        loginInput: "",
        password: "",
        error: "",
      };
    },
  
    methods: {
      async handleLogin() {
      this.error = "";

      try {
        const payload = {
          password: this.password,
        };

        if (this.loginMethod === "userId") {
          payload.userId = this.loginInput;
        } else {
          payload.personalNumber = this.loginInput;
        }

        const response = await Api.post("/users/login", payload);

        setUserObjectId(response.data.ObjectId);
        localStorage.setItem("user", JSON.stringify(response.data));

        this.$router.push("/main");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
      }
      },
    },
  };
  </script>
  
<style src="@/styles/LoginPage.css"></style>
  