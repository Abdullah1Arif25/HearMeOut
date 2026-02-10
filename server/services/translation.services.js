const axios = require("axios");

const translationCache = {};

async function translateText({ messageId, text, target }) {
  if (!messageId || !text || !target) {
    throw new Error("Missing messageId, text, or target language");
  }

  if (!translationCache[messageId]) {
    translationCache[messageId] = {};
  }

  if (translationCache[messageId][target]) {
    return {
      translated: translationCache[messageId][target],
      cached: true,
      failed: false
    };
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_TRANSLATE_API_KEY is missing");
    }

    const res = await axios.post(
      "https://translation.googleapis.com/language/translate/v2",
      {
        q: text,
        target
      },
      {
        params: { key: apiKey }
      }
    );

    const translated =
      res.data?.data?.translations?.[0]?.translatedText;

    if (!translated) {
      throw new Error("No translated text returned");
    }

    translationCache[messageId][target] = translated;

    return {
      translated,
      cached: false,
      failed: false
    };

  } catch (err) {
    console.error(
      "Google Translate error:",
      err.response?.data || err.message
    );

    return {
      translated: text,
      cached: false,
      failed: true
    };
  }
}

module.exports = { translateText };
