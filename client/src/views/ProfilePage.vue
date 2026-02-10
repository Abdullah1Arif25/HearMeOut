<template>
    <div class="profile-wrapper">
      <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
      <div class="profile-card">
  
        <h2 class="title">Profile Settings</h2>
  
        <!-- Choose button -->
        <div v-if="step === 1" class="form">
  
          <button class="confirm-btn" @click="selectAction('password')">
            Change Password
          </button>
  
          <button class="confirm-btn" @click="selectAction('language')">
            Change Language
          </button>
  
        </div>
  
        <!-- VEerify user -->
        <form v-if="step === 2" class="form profile-form-grid" @submit.prevent="verifyUser">

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
        
          <button class="confirm-btn">Confirm</button>
        </form>

  
        <!-- Update password -->
        <form v-if="step === 3 && action === 'password'" class="form"
          @submit.prevent="updatePassword">
  
          <div class="input-group">
            <label>New Password</label>
            <input v-model="newPassword" type="password" maxlength="8" required />
          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button class="confirm-btn">Update Password</button>
        </form>
  
        <!-- Update language -->
        <form v-if="step === 3 && action === 'language'" class="form"
          @submit.prevent="updateLanguage">
  
          <div class="input-group">
            <label>New Language</label>
            <select v-model="newLanguage" required>
                <option disabled value="">Select a language</option>

                <option
                  v-for="lang in languages"
                  :key="lang.code"
                  :value="lang.code">
                  {{ lang.label }}
                </option>
              </select>

          </div>
  
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
  
          <button class="confirm-btn">Update Language</button>
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
  name: "ProfilePage",

  data() {
    return {
      step: 1,
      action: "",
      userId: "",
      personalNumber: "",
      newPassword: "",
      newLanguage: "",
      error: "",
      success: "",
      languages: [
      { label: "Swedish", code: "sv" },
      { label: "English", code: "en" },
      { label: "Arabic", code: "ar" },
      { label: "Spanish", code: "es" },
      { label: "French", code: "fr" },
      { label: "German", code: "de" },
      { label: "Italian", code: "it" },
      { label: "Urdu", code: "ur" },
      { label: "Russian", code: "ru" },
      { label: "Chinese (Mandarin)", code: "zh" },
      { label: "Japanese", code: "ja" },
      { label: "Korean", code: "ko" },
      { label: "Hindi", code: "hi" },
      { label: "Somali", code: "so" },
    ]
    };
  },

  methods: {
    selectAction(type) {
      this.action = type;
      this.step = 2;
    },

    async verifyUser() {
      this.error = "";

      try {
        const res = await Api.get(`/users/${this.userId}`);

        if (!res.data || !res.data.personalNumber) {
          this.error = "User not found.";
          return;
        }

        if (res.data.personalNumber !== this.personalNumber) {
          this.error = "Incorrect personal number.";
          return;
        }

        this.step = 3;

      } catch (err) {
        this.error = err.response?.data?.message || "Verification failed.";
      }
    },

    async updatePassword() {
      this.error = "";
      this.success = "";

      try {
        await Api.patch(`/users/${this.userId}`, {
          password: this.newPassword,
        });

        this.success = "Password updated successfully! Redirecting...";

        setTimeout(() => {
          this.$router.push("/main");
        }, 2000);

      } catch (err) {
        this.error = err.response?.data?.message || "Update failed.";
      }
    },

    async updateLanguage() {
      this.error = "";
      this.success = "";

      try {
        await Api.patch(`/users/${this.userId}`, {
          language: this.newLanguage,
        });

        this.success = "Language updated successfully! Redirecting...";

        setTimeout(() => {
          this.$router.push("/main");
        }, 2000);

      } catch (err) {
        this.error = err.response?.data?.message || "Update failed.";
      }
    }
  },
};
  </script>
  
  <style src="@/styles/ProfilePage.css"></style>

  