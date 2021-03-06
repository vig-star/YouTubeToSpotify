const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config');

router.get('/', (req, res) => {
  let BASE_URL = 'https://api.spotify.com/v1/';
  let headers = {'Authorization': 'Bearer ' + config.access_token}
  if (config.loggedOut == true) {
    console.log("logged out");
    res.send({
        login : false,
        name : "Not Logged In"
    })
  }
  else if (config.access_token != "") {
    request(
      {
        method: "GET",
        url: BASE_URL + "me",
        headers: headers,
        json: true,
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log("Getting Profile");
          console.log(body);
          console.log(body['display_name']);
          res.send(
            {
              login : true,
              name : body['display_name']
            });
        } else {
          console.log("Error fetching profile");
        }
    });
  }


  let GOOGLE_BASE_URL = 'https://www.googleapis.com/youtube/v3/';
  let google_headers = {'Authorization': 'Bearer ' + config.google_access_token};


  if (config.google_access_token != "") {
    /*
    let url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=AIzaSyAYzbzZdl3k7E5YKqUcmEgYr3molHEhVAc`;
    let options = {
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(config.googleClientID + ':' + config.googleClientSecret).toString('base64'))
      },
      json: true
    };
    request.get(url, options, function(error, response, body) {
      if (error) {
        console.log("ERROR");
      }
      if (response.statusCode !== 200) {
        console.log(response.statusCode);
      }
      console.log(body);
    });
    */
  }
});

module.exports = router;