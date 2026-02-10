<template>
  <div class="admin-page">
    <div class="container">
    <div class="row min-vh-100 justify-content-center align-items-center">
      <div class="col-12 col-md-6">
    <div class="admin">

      <h1 class="admin-title">Admin Page</h1>

      <!-- Buttons -->
      <div class="controls">
        <b-button class="admin-button" @click="$router.push('/admin/createrooms')">
        Create Topic Rooms
        </b-button>

        <b-button class="admin-button" @click="$router.push('/admin/users')">
        Display Users
        </b-button>
        
        <b-button class="admin-button" @click="deleteAllMessages">
            Delete All Messages
            </b-button>
      </div>

      <h2 class="section-title">Chat Control</h2>

      <div class="toggle-list">
        <!-- Local Chat -->
        <div class="toggle-row">
          <div class="row-title">Local Chat</div>

          <input
            type="checkbox"
            class="toggle"
            v-model="localRoom.liveChat"
            @change="toggleLocalChat"
          />
          
          <div class="status">{{ localChatStatus }}</div>
        </div>

        <!-- Global Chat -->
        <div class="toggle-row" >
          <div class="row-title">Global Chat</div>
          <input
            type="checkbox"
            class="toggle"
            v-model="globalRoom.live_Chat"
            @change="toggleGlobalChat"
          />

          <div class="status">{{ globalChatStatus }}</div>
         </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
      <p>All messages were successfully deleted.</p>
      <button @click="showPopup = false">Continue</button>
    </div>
  </div>
  </div>
</template>

<script>
import { Api } from "@/Api";
import { socket } from "@/socket/client.socket";

export default {
  name: "AdminPage",

  data() {
    return {
      localRoom: {
        _id: null,
        roomId: null,
        liveChat: false
      },
      globalRoom: {
        _id: null,
        live_Chat: false
      },
      showPopup: false,
    };
  },

  async mounted() {
    await this.fetchRooms();
  },

  computed: {
    localChatStatus() {
      if (this.localRoom.liveChat) {
      return "ON";
    }
    return "OFF";
  },
    globalChatStatus() {
      if (this.globalRoom.live_Chat) {
      return "ON";
    }
    return "OFF";
  }
  }, 

  methods: {
    async fetchRooms() {
        try {
            const localRes = await Api.get("/localrooms");
            this.localRoom = localRes.data[0];
            
        } catch (err) {
            console.error("Failed to load local rooms", err);
        }
        
        try {
            const globalRes = await Api.get("/globalrooms");
            this.globalRoom = globalRes.data;

        } catch (err) {
            console.error("Failed to load global rooms", err);
        }
    },  

    async toggleLocalChat() {
        await Api.put(`/localrooms/${this.localRoom._id}`, {
          liveChat: this.localRoom.liveChat});

          socket.emit("admin chat toggle", {
            roomType: "LocalRoom",
            live: this.localRoom.liveChat
          });
      
    },

    async toggleGlobalChat() {
        await Api.put(`/globalrooms/${this.globalRoom.room_Id}`, {
            live_Chat: this.globalRoom.live_Chat});

            socket.emit("admin chat toggle", {
              roomType: "GlobalRoom",
              live: this.globalRoom.live_Chat
            });
    },

    async deleteAllMessages() {
        try {
            await Api.delete("/messages");
            this.showPopup = true;
        } catch (err) {
            alert("Failed to delete messages");
        }},
  }
};
</script>

<style scoped>@import "../styles/AdminPage.css";</style>
