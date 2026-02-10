// basic configuration
require('dotenv').config();
const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI
  };
  
  module.exports = config;
  