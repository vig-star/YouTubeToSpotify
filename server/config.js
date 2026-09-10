module.exports = {
  // ports
  clientPort: 3000,
  serverPort: 8000,
  clientID: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  redirectURI: process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8000/callback",
  stateKey: "spotifyOath2State",
  state: "",
  access_token: "",
  refresh_token: "",
  loggedOut: false,

  youtube_client_id: process.env.GOOGLE_CLIENT_ID || "",
  youtube_client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
  youtube_state_key: "googleOath2State",
  youtube_redirect_uri:
    process.env.GOOGLE_REDIRECT_URI || "http://127.0.0.1:8000/callbackGoogle",
  youtube_api_key: process.env.YOUTUBE_API_KEY || "",
  youtube_state: "",
  youtube_access_token: "",
  youtube_refresh_token: "",
};
