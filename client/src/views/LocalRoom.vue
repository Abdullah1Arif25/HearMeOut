<template>
    <div class="background-style" :class="{ light: isLight }">

        <!-- Head banner -->
        <div class="head-banner-wrapper row gx-3 d-flex  align-items-center justify-content-between px-2 px-md-3">

            <!-- Left logo -->
            <div class="logo-wrapper">
                <img class="logo-style border-0 bg-transparent" 
                src="@/assets/HMO_logo.png" 
                alt="App Logo" />
            </div>


        <!-- Localroom title and branching room type -->
            <div class="header-flex-box d-flex">
                <h1 class="header-title-style">LOCAL ROOM</h1>

                <div class="category-div-style d-flex column">
                    <h2 class="category-title-style">
                        {{ this.branchingRoomTopic}}
                    </h2>
                </div>
            </div>

            <!-- Menu button -->
            <div class="menu-button-flex">
                <button class="button-icon-style btn-sm" @click="openMenu">
                    <FontAwesomeIcon icon="list-ul" size="xl" style="color: aliceblue;" />
                </button>
            </div>
        </div>

        <!-- Side menu -->
        <div 
            class="side-menu-overlay" 
            v-if="isMenuOpen" 
            @click="closeMenu">
        </div>

        <div 
            class="side-menu-wrapper"
            :class="{ menuVisible: isMenuOpen }">

            <div class="side-menu-content">
                <button class="side-menu-button btn" @click="changeRoomTopic('General')">General</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Scandle')">Scandle</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Travel')">Travel</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Movies')">Movies</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Books')">Books</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Sports')">Sports</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Relationships')">Relationships</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('Food')">Pets</button>
                <button class="side-menu-button btn" @click="changeRoomTopic('School')">Politics</button>
            </div>
        </div>


        <!-- Empty room -->
        <div class="room-box" ref="messageBox" @click="closeAllOptions">



            <!--Message-->
             <div
                v-for="msg in messages"
                :key="msg.messageId" 
                :ref="`msg-${msg.messageId}`"
                class="message-row-wrapper"
                :class="[String(msg.senderId) === String(this.senderObjectId) ? 'my-message':'others-message',
                    activeMessageOption === msg.messageId ? 'message-active' : ''
                ]">
                
                <div class="message-detail-wrapper">
                    <div
                    v-if="msg.ParentMessageId"
                    class="replyPreview"
                    @click="goToMessage(msg.ParentMessageId.MessageId)"
                    >
                    <div class="replyBar"></div>
                    <div class="replyContent">
                        <small class="replyLabel"><em>Replying to</em></small>
                        <p class="replyText">
                            {{ msg.ParentMessageId.Body }}
                        </p>
                    </div>
                </div>

                <small class="message-font-style fw-light"><em>
                    {{ msg.anonymousName}}
                </em></small>

                <p class="message-text-style  fs-6 fw-semibold">
                    {{ msg.Body }}
                </p>

                <small class="message-font-style  fw-light"> <em>
                    {{ new Date(msg.timestamp).toLocaleDateString() }}
                </em></small>

                </div>

                <div
                  v-if="msg.reactions && msg.reactions.length"
                  class="messageReactions">
                  <span
                    v-for="(r, index) in msg.reactions"
                    :key="index"
                    class="reactionEmoji">
                    {{ r.reaction }}
                  </span>
                </div>

                <!--Option Button-->


                <div 
                    class="option-button-wrapper">
                    <button class="option-button-style btn-sm" @click.stop="openOptionMenu(msg.messageId)">•••</button>
                </div>
                
                <!-- Option Menu -->

                 <div 
                    class="option-menu-overlay "
                    v-if="activeMessageOption === msg.messageId"
                    @click.self="closeOptionMenu()">

                    <div class="option-menu-content" @click.stop>
                    <!-- Everyone can reply -->
                    <button class="option-menu-button btn-sm" :disabled="chatPaused" @click="replyToMessage(msg)">Reply</button>
                    <!-- Everyone can react -->
                    <button class="option-menu-button btn-sm" :disabled="chatPaused" @click="toggleReactionMenu(msg)">React</button>
                    <!-- only sender can edit -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="option-menu-button btn-sm"
                      :disabled="chatPaused" @click="editMessage(msg)">Edit</button>
                    <!-- only sender can delete -->
                    <button
                      v-if="String(msg.senderId) === String(senderObjectId)"
                      class="option-menu-button btn-sm"
                      :disabled="chatPaused" @click="deleteMessage(msg)">Delete</button>

                </div>


                    <!-- Reaction Menu -->
                    <div
                        v-if="showReactionsForMessage === activeMessageOption"
                        class="reactionPicker">
                        <button
                            v-for="reaction in REACTIONS"
                            :key="reaction.type"
                            class="reactionButton"
                            @click="reactToMessage(this.activeMessageOption, reaction.emoji)">
                            {{ reaction.emoji }}
                        </button>
                    </div>
                </div>

            </div>

        </div>

        <!--Parent Message in case of responce-->   
        <div
         v-if="this.replyBannerActive"
         class ="parent-message-responce-layout d-flex column px-3 px-md-3"
         :class="[this.replyBannerActive ? show-parent-message: '']">

         <div class="parent-message-text-layout">
            <small><em>Replying to {{this.replyBannerActive }}</em></small>
            <p><strong>{{this.parentMessageContent }}</strong></p>

         </div>
         <button @click.self="DisableReplyBanner()" class="close-button-icon-style">x</button>
        </div>

        <div v-if="chatPaused" class="chatPausedOverlay">
            Chat is currently paused by admin
          </div>

        
        <!-- Footer and bottom banner -->
        <div class="message-box-flex d-flex justify-content-around">
            
            <b-avatar variant="success" icon="people-fill"></b-avatar>

            <div class="message-box-wrapper">
                <form class="input-container" @submit.prevent="sendMessage">
                    <input class ='message-box-style form-control 'type="text" v-model="message" :disabled="chatPaused" :placeholder="chatPaused ? 'Chat is paused' :    isEditing ? 'Editing message…' : 'Send a confession...'"/>
                        <button class="send-button-Inside" type="submit" :disabled="chatPaused">
                            <FontAwesomeIcon  icon="paper-plane" size="l"style="color: #2b0d2b;"  />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                        <button v-if="isEditing" class="cancelbuttonInside" @click="cancelEdit">
                          <FontAwesomeIcon  icon="fa-solid fa-xmark" size="xl"style="color: #2b0d2b;" />
                        </button>
                </form>
            </div>

            <div class="ThemeToggle ">
              <button class=" btn-sm btn-outline-light bg-transparent d-flex text-light border-0" @click="toggleTheme">
                <small>{{ isLight ? "🌙" : "☀" }}</small>
                <small class="d-none d-md-flex align-items-center gap-2">{{ isLight ? "Dark" : "Light" }}</small>
              </button>
            </div>

            <!-- Exit button -->
            <div class="exit-button-wrapper">
            <button class="button-icon-style btn-sm" @click="showSettings = true">
               <FontAwesomeIcon icon="arrow-right-from-bracket" size="xl"style="color: aliceblue;" />
                </button>
            </div>

        </div>
    </div>

    <SettingsPopup v-if="showSettings" @close="showSettings = false"/>
</template>



<script>
import { Api } from '@/Api';
import { socket } from '@/socket/client.socket';
import { getUserObjectId } from '@/cache/user.cache.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SettingsPopup from "./SettingsPopup.vue";
import {followLink} from "../services/hateoas.service";

const REACTIONS = [
  { type: "like", emoji: "👍" },
  { type: "love", emoji: "❤️" },
  { type: "laugh", emoji: "😂" },
  { type: "sad", emoji: "😢" },
  { type: "angry", emoji: "😡" }
];

export default {
    name: 'localroom',
    components: {
        FontAwesomeIcon,
        SettingsPopup
    },


  data() {
    return {
      message: '',
      isMenuOpen: false,
      branchingRoomTopic: 'General',
      branchingRoomId: '',
      messages: [],
      senderObjectId: getUserObjectId(),
      socket,
      chatListner: null,
      activeMessageOption: null,
      parentMessageId: '',
      parentMessageContent: '',
      showReactionsForMessage: null,
      REACTIONS,
      replyBannerActive: '',
      isLight: false,
      showSettings: false,
      chatPaused: false,
      chatPausedMessage: "",
      messageInput: "",
      originalEditMessage: '',
      messageRelatedLinks:null,
      selectedMessageId: null,
      isEditing:null

    };
  },

  beforeUnmount() {
    if (this.socket && this.chatListner) {
      this.socket.off("chat message", this.chatListner);
      this.socket.off("respond to a message", this.chatListner);
      this.socket.off("respond to a message", (msg)=>{

      });

    }
  },

  async mounted() {
    
    const res = await Api.get("/localrooms");
    this.chatPaused = !res.data[0].liveChat;
    this.chatPausedMessage = this.chatPaused ? "Chat is currently paused by admin" : "";

    await this.getAllBranhingRooms();
    this.scrollToBottom();

    if (!this.socket.connected) {
      this.socket.connect();
    }

    this.chatListner = (msg) => {
      const exists = this.messages.some(m => m.messageId === msg.messageId);
      if (exists) return;

      console.log("This is a message we are testing",msg);

      this.messages.push({
        messageId: msg.messageId,
        Body: msg.Body,
        timestamp: msg.SendTimestamp,
        ResponseIds: msg.ResponseIds || [],
        senderId: msg.Sender,
        ParentMessageId: msg.ParentMessageId?{
            Body: msg.ParentMessageId.Body,
            MessageId: msg.ParentMessageId.messageId,
            messageObjectId: msg.ParentMessageId._id,
        }: null,
        messageObjectId: msg._id,
        anonymousName: msg.senderAnonymousName,
        reactions: msg.Reactions || [],
        _links :msg._links|| null,
        anonymousName: msg.Sender.anonymousName || msg.senderAnonymousName,

      });
      console.log(this.messages);

      this.$nextTick(this.scrollToBottom);
    };

    this.socket.on("chat message", this.chatListner);
    this.socket.on("respond to a message", this.chatListner);
    this.socket.on("react to message", (msg)=>{
        const target = this.messages.find(m=> m.messageId === msg.messageId);
        if(target) target.reactions = msg.Reactions || [];
    });

    if (this.branchingRoomId && this.senderObjectId) {
      this.socket.emit("join room", {
        userId: this.senderObjectId,
        roomId: this.branchingRoomId
      });
    }


    this.socket.on("chat status changed", (data) => {
    if (data.roomType !== "LocalRoom") 
      return;
    this.chatPaused = !data.live;
    this.chatPausedMessage = this.chatPaused ? "Chat is currently paused by admin" : "";});
    

  },

  watch: {
    messages() {
      this.$nextTick(this.scrollToBottom);
    },

    branchingRoomId(newId) {
      if (!newId || !this.senderObjectId) return;

      this.socket.emit("join room", {
        userId: this.senderObjectId,
        roomId: newId
      });

      this.fetchMessages().then(() => {
        this.$nextTick(this.scrollToBottom);
      });

    }
  },

  methods: {
    DisableReplyBanner(){
        this.replyBannerActive ='';
    },
    closeAllOptions(){
        this.closeOptionMenu();
        this.closeMenu();


    },
    changeRoomTopic(newTopic) {
      this.branchingRoomTopic = String(newTopic);
      this.getAllBranhingRooms();
      this.closeMenu();
    },

    scrollToBottom() {
      const box = this.$refs.messageBox;
      if (box && box.lastElementChild) {
        box.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }
    },


    goToMessage(parentMessageId){
       this.$nextTick(()=>{
        const ref = this.$refs?.[`msg-${parentMessageId}`];
        const el = Array.isArray(ref)? ref[0]:ref;

        if(!el){
            console.warn("No Dom ref for mresage", parentMessageId);
            return;
        }
         el.scrollIntoView({
                behavior:"smooth"
            });
       });

    },

    openOptionMenu(messageId) {
      this.activeMessageOption = messageId;
      const msg = this.messages.find(m => m.messageId === messageId);
      this.messageRelatedLinks = msg?._links || null;
      console.log("this is the message", msg);
      console.log("this is the message related links", this.messageRelatedLinks);


    },


    

    closeOptionMenu() {
      this.activeMessageOption = null;
      this.showReactionsForMessage = null;
      this.messageRelatedLinks = null;

    },

    openMenu() {
      this.isMenuOpen = true;
    },

    ifParentMessage(msg){
        if(msg.ParentMessageId) return true;
    },

    closeMenu() {
      this.isMenuOpen = false;
    },

    async editMessage(msg){
      this.isEditing = true;
      this.selectedMessageId = msg.messageId;
      this.originalEditMessage = msg.Body; 
      this.message = msg.Body;
      this.closeOptionMenu();

    },

    async deleteMessage(msg){

      try{
        console.log(msg);
        const deleteLink = msg?._links?.deleteMessage;
        if(!deleteLink){
          console.log("No Delete Link on message");
          return;
        }
        await followLink(deleteLink);
        this.activeMessageOption = '';
        this.fetchMessages();
      }catch(err){
        console.err("Delete Failed", err);
      }


    },

    async replyToMessage(msg) {
      this.parentMessageId = msg.messageId;
      this.replyBannerActive = msg.messageId;
      this.parentMessageContent = msg.Body;
      this.closeOptionMenu();
    },

    async getAllBranhingRooms() {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await Api.get("/branchingrooms", {
        params: {
          roomTopic: this.branchingRoomTopic || "General",
          branchingRoomType: "LocalRoom",
          language: user.language
        }
      });

      const room = res.data.Body?.[0];
      this.branchingRoomId = room ? room.branchingRoomId : '';
      console.log(this.branchingRoomId);

      if (this.branchingRoomId) {
        await this.fetchMessages();
      }
    },

    async fetchMessages() {
      if(!this.branchingRoomId){
        console.log('The Branching room is not passed on', this.branchingRoomId)
      }
      const res = await Api.get(
        `/branchingrooms/${this.branchingRoomId}/messages`
      );

      if(!res){
        console.log("No Messages in the branching room");
        return;
      }

      this.messages = res.data.map(m => ({
        senderId: m?.Sender?._id || null,
        ParentMessageId: m.ParentMessageId ? {
            ParentMessageObjectId:m.ParentMessageId._id,
            Body:m.ParentMessageId.Body,
            MessageId: m.ParentMessageId.messageId,
        }: null,
        messageObjectId: m._id,
        ResponseIds: m.ResponseIds,
        messageId: m.messageId,
        anonymousName: m.anonymousName,
        Body: m.Body,
        timestamp: m.SendTimestamp,
        reactions: m.Reactions || [],
        _links:m._links|| null,
        anonymousName: m.Sender.anonymousName || m.senderAnonymousName,

      }));
    },

    async sendMessage() {
      if (this.chatPaused) return;
      if (!this.message.trim()) return;
        if (this.isEditing && this.selectedMessageId) {
          try {
            const msg = this.messages.find(m=> m.messageId === this.selectedMessageId);
            await followLink(msg._links.updateMessage, {Body:this.message});

            this.isEditing = false;
            this.selectedMessageId = null;
            this.message = '';
            this.replyBannerActive = '';
            this.parentMessageContent = '';
            
            await this.fetchMessages();
            return;
          } catch (err) {
            console.error("Failed to edit message:", err);
            return;
          }
        }
      const messageId = this.parentMessageId
        ? `responceMessageId${Math.floor(Math.random() * 100000)}`
        : `messageId${Math.floor(Math.random() * 100000)}`;

      const payload = {
        messageId,
        Body: this.message,
        SendTimestamp: new Date().toISOString(),
        Reaction: null,
        ResponseIds: [],
        Sender: this.senderObjectId,

      };

      if (this.parentMessageId) {
          const msg = this.messages.find(m=> m.messageId === this.parentMessageId);
          console.log(msg._links.createResponse);
          await followLink(msg._links.createResponse, payload);
        this.parentMessageId = '';
      } else {
          await Api.post(`/branchingrooms/${this.branchingRoomId}/messages/`, payload);
      }

      this.message = '';
      this.replyBannerActive='';
      this.parentMessageContent="";

    },

    toggleReactionMenu(msg) {
      this.showReactionsForMessage =
        this.showReactionsForMessage === msg.messageId ? null : msg.messageId;
    },

    async reactToMessage(messageId, reaction) {
        if (this.chatPaused) return;
        const originalMessage = await Api.get( `/branchingrooms/${this.branchingRoomId}/messages/${messageId}`);
        const reactionList = originalMessage.data.Reactions;

        const existingReaction = reactionList.find(
          r => r.userId === this.senderObjectId
        );
        if (existingReaction){
            throw new Error("Only one reaction is reaction")
            return;
        };

        const payload = {
            branchingRoomId: this.branchingRoomId, 
            messageId: messageId, 
            userId: this.senderObjectId,
            reaction: reaction
            
        }

        const msg = this.messages.find(m => m.messageId === messageId);

        followLink(msg._links.reactToMessage, payload);

      if (msg) {
        msg.reactions = res.data.reactions || [];
      }

      this.closeOptionMenu();
    }, 

    toggleTheme() {
            this.isLight = !this.isLight;
        },

    cancelEdit() {
      this.isEditing = false;
      this.selectedMessageId = null;
      this.message = '';              
      this.originalEditMessage = ''; 
    },
  }
}
</script>


<style>

.background-style {
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
}

/* Header */
.head-banner-wrapper {
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: clamp(6px, 1vw, 26px) clamp(0px, 0vw, 15px);
    padding-right: 10px;
    align-items: center;
    justify-content: space-between;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 1000;
    height: var(--header-h);
}

.logo-wrapper,
.menu-button-flex {
    flex: 1;
    display: flex;
    align-items: center;
}

.logo-wrapper {
    justify-content: flex-start;
}

.menu-button-flex {
    justify-content: flex-end;
}

.logo-style {
    width: clamp(45px, 12vw, 100px);
}

.header-flex-box {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-title-style {
    font-size: clamp(10px, 5vw, 30px);
    font-weight: bolder;
    color: rgb(249, 249, 249);
    margin: 0;
}

.category-div-style {
    background-color: #ffecec;
    border-radius: 10px;
    padding: 6px 16px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(200px, 20vw, 330px);
    max-width: 70%;
}

.category-title-style {
    font-size: clamp(14px, 1.5vw, 25px);
    margin: 0;
    color: #2b0d2b;
}

/* Room Container */
.room-box {
    background: linear-gradient(#2b0d2b, #6d2a46);
    flex: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    padding: 80px 12px 90px;
}

/* Side Menu */
.side-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1500;
}

.side-menu-wrapper {
    position: fixed;
    top: var(--header-h);
  right: 0;

  width: min(400px, 80vw);
    height: calc(100dvh - var(--header-h) - var(--footer-h));

    background: rgba(255, 255, 255, 0.535);
    backdrop-filter: blur(6px);
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;

  padding: 20px 10px;
    z-index: 1600;

    overflow-y: auto;
    overflow-x: hidden;

  transform: translateX(110%);
  transition: transform 0.35s ease;
  will-change: transform;
}

.side-menu-wrapper.menuVisible {
  transform: translateX(0);
}


.side-menu-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.side-menu-button {
    width: 100%;
    padding: 12px 0px;
    background: linear-gradient(#2b0d2b, #6d2a46);
    border: none;
    border-radius: 16px;
    color: #fff !important;
    font-size: clamp(10px, 5vw, 20px);
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;
}

.side-menu-button:hover {
    opacity: 0.8;
    transform: scale(1.02);
}

/* Messages */
.message-row-wrapper {
    position: relative;
    padding: clamp(5px, 1vw, 35px) clamp(15px, 2vw, 40px);
    width: fit-content;
    max-width: clamp(320px, 80vw, 900px);
    min-width: clamp(220px, 45vw, 320px);
    display: flex;
    flex-direction: row;
    margin: 6px 0;
    border-radius: 10px;
}

.message-active {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.my-message {
    align-self: flex-end;
    background: linear-gradient(#ffc2c2, #936480);
    color: #2b0d2b;
    border-bottom-right-radius: 2px;
}

.others-message {
    align-self: flex-start;
    background: linear-gradient(#311731, #4f2d3b);
    color: #ffffff;
    border-bottom-left-radius: 2px;
}

.others-message .message-text-style {
    color: #ffffff;
}

.others-message .message-font-style {
    color: rgba(255, 255, 255, 0.75);
}

.message-text-style {
    margin: 0 0 3px 0;
}

.message-font-style {
    font-size: 1wmax;
    opacity: 0.7;
}

.message-detail-wrapper {
    display: flex;
    flex: 2;
    flex-direction: column;
    min-height: 0; 
    overflow: visible;
}


.message-box-flex {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(#2b0d2b, #6d2a46);
    padding: clamp(2px, 1.5vw, 25px) clamp(2px, 0.5vw, 10px);
    align-items: center;
    gap: clamp(2px, 0.5vw, 5px);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    z-index: 1000;
    height: var(--footer-h);
}

.parent-message-display{
    display: flex;
    flex:1;
    background:#fdfdfd;
    border-radius: 10px;
    height: 20px;
    width: 100%;
    top: 100%;
}

.profile-detail-wrapper {
    width: 6vmax;
    height: 5vmax;
    border-radius: 1000px;
    object-fit: cover;
}

.message-box-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
}

.input-container {
    position: relative;
    width: 100%;
}

.message-box-style {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    border: none;
    padding-left: 14px;
    padding-right: 50px;
    font-size: inherit
}

.parent-message-responce-layout{
    position: fixed;
    bottom:var(--footer-h);
    display: flex;
    left:12px;
    right:12px;
    width: auto;
    margin-top: 8px;
    background: rgba(255, 184, 213, 0.28);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    padding: 12px  14px 12px 18px;
    z-index: 20000;
    height: clamp(7vh, 65px, 15vh);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.parent-message-responce-layout::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 10px;
  bottom: 10px;

  width: 4px;
  border-radius: 4px;

  background: rgba(120, 40, 85, 0.542);
}

.parent-message-text-layout{
    flex-direction: column;
    flex: 3dvh;

}
.show-parent-message{
    right: 30px;
}

.send-button-Inside {
    background: transparent;
    border: none;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.cancelbuttonInside {
    background: transparent;
    border: none;
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

/* Option Menu */
.option-button-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.option-button-style {
    background: transparent;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease;
}

.option-button-style:hover {
    background: rgba(255, 255, 255, 0.18);
}

.option-menu-overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 8px;
    background: rgba(40, 20, 35, 0.92);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 10px;
    z-index: 2000;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.others-message.option-menu-overlay {
    left: 10px;
    right: auto;
}

.option-menu-overlay.visibleOption {
    right: 0;
}

.option-menu-content {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: space-between;
}

.option-menu-button {
    all: unset;
    flex: 1;
    padding: 12px 0;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #fff !important;
    text-align: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.18);
    transition: background 0.15s ease, transform 0.15s ease;
}

.option-menu-button:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: translateY(-1px);
}


.setting-button-wrapper,
.exit-button-wrapper {
    display: flex;
}

.button-icon-style {
    background: transparent;
    border: none;
    cursor: pointer;
}

.close-button-icon-style {
    background: transparent;
    border: none;
    font-size: x-large;
    cursor: pointer;
}
.messageBox-style {
    color: #fdfdfd;
}


:root {
    --header-h: clamp(95px, 15vh, 130px);
    --footer-h: clamp(70px, 10vh, 100px);
}

.reactionPicker {
    position: absolute;
    bottom: 100%;
    left: 0;
    background: rgba(40, 20, 35, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    padding: 8px;
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    z-index: 20001;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.reactionButton {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.reactionButton:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
}

.messageReactionFloating {
  position: absolute;
  bottom: -12px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}


.reaction-right {
  right: 12px;
}

.reaction-left {
  left: 12px;
}

.light.background-style {
  background: linear-gradient(#f5e1e6, #d6b2bf);
}

.header-title-style {
  color: white;
}

.light .header-title-style {
  color: #2b0d2b;
}

.button-icon-style svg {
  color: white;
}

.light .button-icon-style svg {
  color: #2b0d2b;
}

.light .head-banner-wrapper {
  background: linear-gradient(#f3dbe3, #caa0b1);
}

.light .category-div-style {
  background: #ffffff;
}

.light .category-title-style {
  color: #5a2b44;
}

.light .room-box {
  background: linear-gradient(#f5e1e6, #d6b2bf);
}

.light .side-menu-wrapper {
  background: rgba(255, 255, 255, 0.85);
}

.light .side-menu-button {
  background: linear-gradient(#7a3b5a, #9a5f7a);
}

.light .message-box-flex {
  background: linear-gradient(#f3dbe3, #caa0b1);
}

.light .message-box-style {
  background: white;
  color: #2b0d2b;
}

.light .others-message {
  background: linear-gradient(#7a3b5a, #9a5f7a);
}

.light .my-message {
  background: white;
  color: #2b0d2b;
}

.light .ThemeToggle {
  border-color: rgba(0,0,0,0.25);
  color: #2b0d2b;
}

.light .ThemeToggle:hover {
  background: rgba(0,0,0,0.08);
}


.ThemeToggle {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  color: white;
  padding: 4px 6px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.3s;
}

.ThemeToggle:hover {
  background: rgba(255,255,255,0.15);
}


.replyPreview {
  display: flex;
  
  gap: 8px;
  margin-bottom: 6px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
  top: 100%;
  left: 1px;
  right: 1px;
}

.replyBar {
  width: 4px;
  border-radius: 2px;
}

.replyContent {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.replyContent::before {
  content: "";
  position: absolute;
  left:8px;
  top: 10px;
  bottom: 10px;
  width: 4px;
  background:rgba(120, 40, 85, 0.542);
}

.replyLabel {
  font-size: 0.7rem;
  opacity: 0.7;
}

.replyText {
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>




