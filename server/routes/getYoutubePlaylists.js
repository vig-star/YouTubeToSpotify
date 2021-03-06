const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("../config");

router.get("/", (req, res) => {
  let BASE_URL = "https://youtube.googleapis.com/youtube/v3/playlists?";
  let headers = { Authorization: "Bearer " + config.youtube_access_token };
  let playlists = [];
  if (config.youtube_access_token != "") {
    request(
      {
        method: "GET",
        url: BASE_URL + "part=snippet&mine=true&key=" + config.youtube_api_key,
        headers: headers,
        json: true,
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          //console.log(body["items"][0].snippet.title);
          console.log(body);
          for (let i = 0; i < body["items"].length; i++) {
            playlists[i] = body["items"][i].snippet.title;
          }
          res.send({
            itemsYT: playlists,
          });
        } else {
          console.log("Error fetching playlist");
        }
      }
    );
  }
});

module.exports = router;
