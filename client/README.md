# YouTubeToSpotify · Client

React 17 interface for the playlist-transfer prototype. See the [root README](../README.md) for credentials, callback URLs, current functionality, and limitations.

From the repository root:

```bash
npm ci --prefix client
npm run client
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Start the Express API separately with `npm start` from the root.

`npm run build` creates `client/build/`; `npm test -- --runInBand` runs the interface smoke test. The scripts retain Create React App 4 and its Webpack 4 compatibility flag.
