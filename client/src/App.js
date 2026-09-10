import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    data: null,
    loggedIn: false,
    loggedInYouTube: false,
    username: "Not Logged In",
    playlistsSpotify: [],
    canConvert: false,
    currentPlaylistName: null,
    playlistsYoutube: [],
    snippetYoutube: [],
    item: [],
    playlistTracks: [],
    youTubeVideoIds: [],
    YTPlaylistID: null,
    itemYT: [],
    isActive: false,
    isActiveYT: false,
    names: [],
    playlistIds: [],
  };

  componentDidMount() {
    this.callBackendAPI()
      .then((res) => this.setState({
        data: res.express,
        loggedIn: res.login,
        username: res.name,
      }))
      .catch((err) => console.error(err));

    this.playlistSpotify()
      .then((res) => this.setState({
        playlistsSpotify: res.items,
        names: res.names,
        playlistIds: res.playListIDs,
      }))
      .catch((err) => console.error(err));

    this.playlistYoutube()
      .then((res) => this.setState({ playlistsYoutube: res.itemsYT }))
      .catch((err) => console.error(err));
  }

  playlistSpotify = async () => {
    const response = await fetch("/getSpotifyPlaylists");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  playlistYoutube = async () => {
    const response = await fetch("/getYoutubePlaylists");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.setState({ loggedInYouTube: true });
    return body;
  };

  callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  loginSpotify() {
    window.location.href = "http://127.0.0.1:8000/loginSpotify";
  }

  logoutSpotify() {
    window.location.href = "http://127.0.0.1:8000/logout";
  }

  loginYoutube() {
    window.location.href = "http://127.0.0.1:8000/loginGoogle";
  }

  handleYoutube = () => {
    this.setState({ isActiveYT: !this.state.isActiveYT });
  };

  handleSpotify = () => {
    this.setState({ isActive: !this.state.isActive });
  };

  convertPlaylist = async (playListName) => {
    let youTubePlaylistID;
    const videoIDs = [];
    const requestOptions = { method: "GET", redirect: "follow" };

    await fetch(
      "http://127.0.0.1:8000/createYouTubePlaylist?name=" + playListName,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        youTubePlaylistID = JSON.parse(result).id;
      });

    // The existing prototype transfers the first two tracks.
    for (let i = 0; i < 2; i++) {
      const result = await fetch(
        "http://127.0.0.1:8000/searchTrackInYouTube?name=" +
          this.state.playlistTracks[i],
        requestOptions
      );
      const data = await result.json();
      videoIDs.push(data.id);
    }

    for (let i = 0; i < videoIDs.length; i++) {
      try {
        await fetch(
          "http://127.0.0.1:8000/updatePlaylist?pID=" +
            youTubePlaylistID + "&vID=" + videoIDs[i],
          requestOptions
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  getID = (playListName) => {
    let playlistID = "";
    for (let i = 0; i < this.state.names.length; i++) {
      if (this.state.names[i] === playListName) {
        playlistID = this.state.playlistIds[i];
        break;
      }
    }

    const requestOptions = { method: "GET", redirect: "follow" };
    fetch(
      "http://127.0.0.1:8000/getPlaylistTracks?id=" + playlistID,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        this.setState({
          playlistTracks: JSON.parse(result).trackList,
          currentPlaylistName: playListName,
          canConvert: true,
        });
      });
  };

  render() {
    const {
      loggedIn,
      loggedInYouTube,
      username,
      canConvert,
      currentPlaylistName,
      isActive,
      isActiveYT,
      names,
      playlistsYoutube,
    } = this.state;

    const spotifyIcon = (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="currentColor" />
        <path d="M8 12c5-1.6 11-1.1 16 1.5M9 16.5c4.4-1.3 9.5-.7 13.5 1.4M10 21c3.7-1 7.5-.5 11 1" stroke="#17251c" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
    );
    const youtubeIcon = (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="6" width="30" height="21" rx="7" fill="currentColor" />
        <path d="m13 11.5 8 5-8 5v-10Z" fill="white" />
      </svg>
    );
    const arrowIcon = (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

    return (
      <div className="App">
        <a className="skip-link" href="#converter">Skip to converter</a>
        <div className="page-shell">
          <header className="site-header">
            <a className="wordmark" href="/" aria-label="YouTubeToSpotify home">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 28 28" fill="none">
                  <path d="M5 9h17m-5-5 5 5-5 5M23 19H6m5-5-5 5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>YouTube<span className="wordmark-to">To</span>Spotify</span>
            </a>
            <span className="header-note"><span className="status-dot" />A little less playlist admin.</span>
          </header>

          <main>
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-copy">
                <p className="eyebrow"><span />MADE FOR YOUR MUSIC</p>
                <h1 id="hero-title">Good music.<br /><span>A different home.</span></h1>
                <p className="hero-description">Bring your Spotify playlists to YouTube.<br className="desktop-break" /> Keep the collection. Change where you listen.</p>
                <div className="direction-label">
                  <span className="mini-service spotify-color">{spotifyIcon}</span>
                  <span>Spotify</span>
                  <span className="direction-arrow">{arrowIcon}</span>
                  <span className="mini-service youtube-color">{youtubeIcon}</span>
                  <span>YouTube</span>
                </div>
              </div>
              <div className="record-art" aria-hidden="true">
                <div className="art-caption"><span>YOUR ROTATION</span><span>VOL. 01</span></div>
                <div className="record-disc"><div className="record-label"><span /></div></div>
                <div className="record-sleeve">
                  <div className="sleeve-top"><span>PLAY IT<br />SOMEWHERE NEW.</span><span>↗</span></div>
                  <div className="sleeve-lines"><i /><i /><i /><i /><i /></div>
                  <div className="sleeve-bottom"><span>SAME GOOD TASTE.</span><span>33⅓</span></div>
                </div>
                <div className="art-bottom"><span>LESS REBUILDING.</span><span>MORE REPLAYING.</span></div>
              </div>
            </section>

            <section id="converter" className="workspace" aria-labelledby="converter-title">
              <div className="workspace-heading">
                <div><p className="eyebrow">THE PLAYLIST HANDOFF</p><h2 id="converter-title">Make the move.</h2></div>
                <span className="prototype-badge">2-track prototype</span>
              </div>
              <div className="workspace-grid">
                <section className="connections" aria-labelledby="connections-title">
                  <div className="section-label"><span className="step-number">01</span><h3 id="connections-title">Connect your accounts</h3></div>
                  <div className="service-card">
                    <div className="service-heading">
                      <span className="service-icon spotify-color">{spotifyIcon}</span>
                      <div><h4>Spotify</h4><p>Your playlist source</p></div>
                      <span className={`connection-status ${loggedIn ? "is-connected" : ""}`}><span />{loggedIn ? "Connected" : "Not connected"}</span>
                    </div>
                    {loggedIn && <p className="account-name">Signed in as {username}</p>}
                    <button type="button" className={`button service-button ${loggedIn ? "button-secondary" : "button-spotify"}`} onClick={loggedIn ? this.logoutSpotify : this.loginSpotify}>
                      {loggedIn ? "Disconnect Spotify" : "Connect Spotify"}<span>{arrowIcon}</span>
                    </button>
                  </div>
                  <div className="service-card">
                    <div className="service-heading">
                      <span className="service-icon youtube-color">{youtubeIcon}</span>
                      <div><h4>YouTube</h4><p>Your playlist destination</p></div>
                      <span className={`connection-status ${loggedInYouTube ? "is-connected" : ""}`}><span />{loggedInYouTube ? "Connected" : "Not connected"}</span>
                    </div>
                    <button type="button" className="button button-secondary service-button" onClick={this.loginYoutube}>
                      {loggedInYouTube ? "Reconnect YouTube" : "Connect YouTube"}<span>{arrowIcon}</span>
                    </button>
                  </div>
                  <p className="connection-note">Connect both accounts before converting a playlist.</p>
                </section>

                <section className="playlist-panel" aria-labelledby="playlist-title">
                  <div className="section-label"><span className="step-number">02</span><h3 id="playlist-title">Choose your playlist</h3></div>
                  <div className="playlist-content">
                    {loggedIn ? (
                      <div className="playlist-accordions">
                        <div className="accordion">
                          <button type="button" className="accordion-toggle" onClick={this.handleSpotify} aria-expanded={isActive} aria-controls="spotify-playlists">
                            <span><span className="mini-service spotify-color">{spotifyIcon}</span>Spotify playlists<span className="playlist-count">{names.length}</span></span><span className="accordion-chevron" aria-hidden="true">{isActive ? "−" : "+"}</span>
                          </button>
                          <div id="spotify-playlists" hidden={!isActive} className="playlist-list">
                            {names.length ? names.map((name, index) => (
                              <button type="button" className={`playlist-option ${currentPlaylistName === name ? "is-selected" : ""}`} key={`${this.state.playlistIds[index]}-${index}`} onClick={() => this.getID(name)} aria-pressed={currentPlaylistName === name}>
                                <span className="playlist-option-icon" aria-hidden="true">♫</span><span>{name}</span><span className="selection-indicator" aria-hidden="true">{currentPlaylistName === name ? "✓" : ""}</span>
                              </button>
                            )) : <p className="list-empty">No Spotify playlists are available.</p>}
                          </div>
                        </div>
                        <div className="accordion">
                          <button type="button" className="accordion-toggle" onClick={this.handleYoutube} aria-expanded={isActiveYT} aria-controls="youtube-playlists">
                            <span><span className="mini-service youtube-color">{youtubeIcon}</span>YouTube playlists<span className="playlist-count">{playlistsYoutube.length}</span></span><span className="accordion-chevron" aria-hidden="true">{isActiveYT ? "−" : "+"}</span>
                          </button>
                          <div id="youtube-playlists" hidden={!isActiveYT} className="playlist-list">
                            {playlistsYoutube.length ? playlistsYoutube.map((name, index) => <p className="youtube-playlist" key={`${name}-${index}`}><span aria-hidden="true">♫</span>{name}</p>) : <p className="list-empty">No YouTube playlists are available.</p>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-playlists">
                        <div className="playlist-illustration" aria-hidden="true"><span className="illustration-note">♫</span><div><i /><i /><i /></div><span className="illustration-arrow">↗</span></div>
                        <h4>Your next listen starts here.</h4>
                        <p>Connect Spotify to find your playlists,<br />then choose the one to bring along.</p>
                      </div>
                    )}
                  </div>
                  <div className="convert-area">
                    <div className="selection-summary"><span>{canConvert ? "READY TO MOVE" : "NOTHING SELECTED YET"}</span><p>{canConvert ? currentPlaylistName : "A playlist. A new place to play."}</p></div>
                    <button type="button" className="button button-convert" disabled={!canConvert} onClick={() => this.convertPlaylist(currentPlaylistName)}>Convert to YouTube<span>{arrowIcon}</span></button>
                  </div>
                </section>
              </div>
              <div className="workspace-note"><span className="info-icon" aria-hidden="true">i</span><p>This prototype creates a YouTube playlist using the first two tracks of your selected Spotify playlist.</p></div>
            </section>

            <ol className="process-list" aria-label="How it works">
              <li><span>01</span><div><h3>Connect</h3><p>Bring your two accounts together.</p></div></li>
              <li><span>02</span><div><h3>Choose</h3><p>Pick a playlist from your Spotify library.</p></div></li>
              <li><span>03</span><div><h3>Convert</h3><p>Find your tracks a home on YouTube.</p></div></li>
            </ol>
          </main>
          <footer className="site-footer"><span>YouTubeToSpotify</span><p>An independent playlist project. Made for the love of music.</p><span className="footer-signoff">KEEP THE GOOD STUFF. ↗</span></footer>
        </div>
      </div>
    );
  }
}

export default App;
