<template>
    <div class="login-wrapper">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-5">
            <div class="login-card">
  
        <h2 class="title">Update Password</h2>
  
        <!-- Verify user -->
        <form @submit.prevent="verifyUser" class="form login-form-grid" v-if="!verified">
        <div class="inputs-row">
          <div class="input-group">
            <label>UserID</label>
            <input v-model="userId" type="text" required />
          </div>
  
          <div class="input-group">
            <label>Personal Number</label>
            <input v-model="personalNumber" type="text" maxlength="10" required />
          </div>
        </div> 
  
          <p v-if="error" class="error">{{ error }}</p>
  
          <button type="submit" class="login-btn">Confirm</button>
        </form>
  
        <!-- Enter new password -->
        <form @submit.prevent="updatePassword" class="form login-form-grid" v-else>

          <div class="inputs-row">
          <div class="input-group">
            <label>New Password</label>
            <input v-model="newPassword" type="password" maxlength="8" required />
          </div>
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button type="submit" class="login-btn">Update</button>
        </form>
  
      </div>
    </div>
  </div>
  </div>
</div>
  </template>
  
  <script>
  import { Api } from "@/Api";
  
  export default {
    name: "PasswordPage",
  
    data() {
      return {
        userId: "",
        personalNumber: "",
        newPassword: "",
        verified: false,
        error: "",
        success: "",
      };
    },
  
    methods: {
      // Verify user using GET /users/:userId
      async verifyUser() {
        this.error = "";
  
        try {
          const res = await Api.get(`/users/${this.userId}`);
  
          if (!res.data || !res.data.personalNumber) {
            this.error = "User not found.";
            return;
          }
  
          // Compare personal number
          if (res.data.personalNumber !== this.personalNumber) {
            this.error = "Personal number is incorrect.";
            return;
          }
  
          this.verified = true;
  
        } catch (err) {
          this.error = err.response?.data?.message || "Verification failed.";
        }
      },
  
      // Update password using PATCH /users/:userId
      async updatePassword() {
        this.error = "";
        this.success = "";
  
        try {
          await Api.patch(`/users/${this.userId}`, {
            password: this.newPassword,
          });
  
          this.success = "Password updated successfully!";
        } catch (err) {
          this.error = err.response?.data?.message || "Update failed.";
        }
      },
    },
  };
  </script>
  

  <style src="@/styles/PasswordPage.css"></style>
  