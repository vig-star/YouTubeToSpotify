const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("../config");

router.get("/", (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let cookie = req.cookies ? req.cookies[config.youtube_state_key] : null;
  if (state !== cookie) {
    console.log("cookie mismatch");
  }
  if (state !== null && state === cookie) {
    res.clearCookie(config.youtube_state_key);
    request(
      // POST request to /token endpoint
      {
        method: "POST",
        url: "https://oauth2.googleapis.com/token",
        form: {
          code: code,
          redirect_uri: config.youtube_redirect_uri,
          grant_type: "authorization_code",
        },
        headers: {
          Authorization:
            "Basic " +
            new Buffer.from(
              config.youtube_client_id + ":" + config.youtube_client_secret
            ).toString("base64"),
        },
        json: true,
      },

      // callback
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          config.youtube_access_token = body.access_token;
          config.youtube_refresh_token = body.refresh_token;
          res.redirect(`http://127.0.0.1:${config.clientPort}`);
          console.log("Successfully logged into Youtube");
        } else {
          console.log("error");
          console.log(response.statusCode);
          console.log(response.headers);
        }
      }
    );
  } else {
    console.log("Cookie mismatch or null state");
  }
});

module.exports = router;
