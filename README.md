## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

HearMeOut is a web based anonymous confession and support platform for users aged 18+. It provides a safe space for people to share their thoughts, emotions, or struggles without fear of judgment. Users register securely, then choose between local chat (people from their own country) or global chat (connect with people worldwide), the user also has the option to enter a confession room that is dedicated to only one specific topic. In global mode, all messages are automatically translated into each user’s native language, enabling real emotional exchange across cultures. To protect privacy, every time a user enters a chat room, a new random username is generated, keeping interactions fully anonymous.

### Pages

- Registration page:

  - Users register using their personal number to verify eligibility.
  - After verification, users receive a unique ID, create a password, and choose their preferred language.
  - Login is done using the given ID and password.

- Home page:

  - Users can choose between Local or Global confession rooms.
  - Provides quick access to the live chat and branching room menus.

- Local page:

  - Allows users to enter local confession rooms.
  - Includes topic based subrooms (branching rooms) for more focused discussions.

- Global page:

  - Displays confession rooms that connect users from multiple countries.
  - Enables international discussions through a live chat interface with translation, reply, and reaction features.

- Confession page:
  - Shows how users are interacting in the confession rooms.
  - Displays message exchanges, reactions, and user participation in real time.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ER-Diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)


### Team Members (AG9)

- Sireen Abu Ajamieh
- Aisha Attar
- Abdullah Arif


## Advanced Feature:

### Real-Time Message Translation (Using Google Cload Translate)

In the basic version of HearMeOut, users can send messages using the sockets. Each of these messages would be in their own original language.

We plan to build an advanced Real-Time Message Translation feature for the chat system. Instead of page reload or global language toggle, users will be able to translate any individual message into their default language on the fly.

---

### Backend Implementation:

#### Endpoint:

`GET /api/translations/messages/:messageId/?targetLang="xx"`

#### Integrate Socket.IO:

We will attach the existing Socket.IO instance with the Express Json Server. This allows us to emit translated messages back to the specific user on all active devices or tabs.

#### Real-Time Translation:

The message will be translated on the fly without making changes to the original message. We will use caches to store the translated messages for the time of the session. This prevents repeated API calls for the same message + language combination.

#### Cache Management (In-Memory Map):

The Translated version will be stored in a cache for each message with a unique cache key in  
`${messageId}:${targetLang}` format.

This will help reduce the API call to translate the same message, while we keep the original text for data integrity.  
The backend will translate that single message using our translation API (Google Cloud Translate).

---

### Event Flow:

1. **Received Request** → Backend API receives the original message Id with the target language.
2. **Cache Lookup** → Backend checks if the message has already been translated to prevent access API calls.
3. **If cached if not found, then:**
   - **Fetch Original Message** → Fetches the original Message Collection using the messageId.
   - **Translation Request** → Send the message body to the (Google Cloud Translate) API.
   - **Send Translated Message** → Send the translated version to the frontend.
   - **Store in Cache** → Store the cache to a map in TranslationCache.js with a TTL (e.g 20 minutes).

---

### Frontend Implementation:

#### Integrate Socket.IO Client:

Install the socket.io client on the frontend and connect it to the backend socket.io. This will help us emit the translated message for the same user on different devices.

#### Live Chat Interface:

The frontend Live chat interface, created using Vue, will provide the "Translate Message" for all the messages whose language doesn’t match the user default language.

#### Calling Translation API end-point:

When the user clicks on the “Translate Message” button, it will trigger a call to the backend translation API. This endpoint will return with the translated message and will replace the original message without refreshing the page.

---

### Event Flow:

1. **Call the Endpoint** → `GET /api/translations/messages/:messageId?targetLang="xx"`.
2. **Backend Response Body** → The backend sends back the translated version with the original message ID and target language.
3. **Replace the Original Message** → Replace the frontend message on the fly.

