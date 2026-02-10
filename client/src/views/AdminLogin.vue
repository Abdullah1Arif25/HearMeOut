<template>
    <div class="login-wrapper">
      <div class="container">
      <div class="row min-vh-100 justify-content-center align-items-center">
      <div class="col-12 col-md-6">
      <div class="login-card">

        <!-- Header -->
        <h2 class="title">Admin Login</h2>  
        <b-form @submit.prevent="handleLogin">
        
        <b-form-group
          label="Admin ID"
          label-align="left"
          >
          <b-form-input id="user-id" v-model="loginInput" type="text" required autocomplete="username"/>
        </b-form-group>

        <b-form-group
          label="Password"
          label-for="password"
        >
          <b-form-input id="password" v-model="password" type="password" required autocomplete="current-password"/>     
          </b-form-group>

        <b-button type="submit" variant="light" class="login-btn" >Login</b-button>


        <b-alert v-if="error" show class="mt-3"> {{ error }}</b-alert>

      </b-form>
  
      </div> 
        </div>  
      </div>    
    </div>      
  </div>       
</template>
  
  <script>
  import { Api } from "../Api";
    import {setUserObjectId } from "@/cache/user.cache";
  
  export default {
    name: "AdminLogin",
  
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
  <style scoped>@import "../styles/AdminLogin.css";</style>
