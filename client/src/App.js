import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    data: null,
    loggedIn: false,
    loggedInYouTube: false,
    username: "Not Logged In",
    playlistsSpotify: [],
    playlistsYoutube: [],
    snippetYoutube: [],
    item: [],
    itemYT: [],
  };

  componentDidMount() {
    this.callBackendAPI()
      .then((res) =>
        this.setState({
          data: res.express,
          loggedIn: res.login,
          username: res.name,
        })
      )
      .catch((err) => console.log(err));

    this.playlistSpotify()
      .then((res) =>
        this.setState({
          playlistsSpotify: res.items,
          //item: res.items[0],
        })
      )
      .catch((err) => console.log(err));

    this.playlistYoutube()
      .then((res) =>
        this.setState({
          playlistsYoutube: res.itemsYT,
        })
      )
      .catch((err) => console.log(err));
  }

  playlistSpotify = async () => {
    const response = await fetch("/getSpotifyPlaylists");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  playlistYoutube = async () => {
    let response = await fetch("/getYoutubePlaylists");
    let body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  loginSpotify() {
    window.location.href = "http://localhost:8000/loginSpotify";
  }

  logoutSpotify() {
    window.location.href = "http://localhost:8000/logout";

    /*const url = 'https://www.spotify.com/logout/'
      let left = (screen.width/2)-(700/2);
      let top = (screen.height/2)-(700/2);
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=700,top='+top+',left='+left);
      setTimeout(() => spotifyLogoutWindow.close(), 2000);*/
  }

  loginYoutube() {
    window.location.href = "http://localhost:8000/loginGoogle";
  }

  render() {
    const isLoggedIn = this.state.loggedIn;
    let button;
    if (!isLoggedIn) {
      button = <button onClick={this.loginSpotify}>Login to Spotify</button>;
    } else {
      button = <button onClick={this.logoutSpotify}>Logout of Spotify</button>;
      let names = [];
      console.log("SPOTIFY");
      for (let i = 0; i < this.state.playlistsSpotify.length; i++) {
        this.state.item = this.state.playlistsSpotify[i];
        names[i] = this.state.item.name;
        console.log(names[i]);
      }
      console.log("YOUTUBE");
      for (let i = 0; i < this.state.playlistsYoutube.length; i++) {
        console.log(this.state.playlistsYoutube[i]);
      }
      // <React.Fragment>
      //   <h1>Spotify Playlist</h1>
      //   <div className="accordion">
      //     <div className="accordion-item">
      //       <div className="accordion-title">
      //         <div>{title}</div>
      //         <div>+</div>
      //       </div>
      //       <div className="accordion-content">{content}</div>
      //     </div>
      //   </div>
      // </React.Fragment>;
      //this.state.itemYT = this.state.playlistsYoutube[0];
      //console.log(itemYT);
      //this.state.snippetYoutube = this.state.itemYT[0];
      // for (let i = 0; i < this.state.playlistsYoutube.length; i++) {
      //   this.state.item = this.state.playlistsYoutube[i];
      //   this.state.snippetYoutube = this.state.item[i];
      //   names[i] = this.state.snippetYoutube.title;
      //   console.log(names[i]);
      // }
    }
    // const isYoutubeLoggedIn = this.state.loggedInYouTube;
    // let youtubeButton;
    // if (!isYoutubeLoggedIn) {
    //   youtubeButton = (
    //     <button onClick={this.loginYoutube}>Login to YouTube</button>
    //   );
    // } else {
    //   youtubeButton = (
    //     <button onClick={this.logoutSpotify}>Logout of YouTube</button>
    //   );
    //   for (let i = 0; i < this.state.itemYT.length; i++) {
    //     console.log(this.state.itemYT[i]);
    //   }
    //   //this.state.itemYT = this.state.playlistsYoutube[0];
    //   //console.log(itemYT);
    //   //this.state.snippetYoutube = this.state.itemYT[0];
    //   // for (let i = 0; i < this.state.playlistsYoutube.length; i++) {
    //   //   this.state.item = this.state.playlistsYoutube[i];
    //   //   this.state.snippetYoutube = this.state.item[i];
    //   //   names[i] = this.state.snippetYoutube.title;
    //   //   console.log(names[i]);
    //   // }
    // }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Youtube To Spotify</h1>
          <p className="App-intro">{this.state.username}</p>
          <div>
            <p>{button}</p>
            <p>
              <button onClick={this.loginYoutube}>Login to YouTube</button>
            </p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
