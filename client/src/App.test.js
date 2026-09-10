import { act, render, screen } from '@testing-library/react';
import App from './App';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('shows account connections, playlist controls, and the existing conversion limit', async () => {
  const responses = {
    '/express_backend': { express: 'Connected', login: true, name: 'Listener' },
    '/getSpotifyPlaylists': {
      items: [{ id: 'playlist-1', name: 'Sunday listening' }],
      names: ['Sunday listening'],
      playListIDs: ['playlist-1'],
    },
    '/getYoutubePlaylists': { itemsYT: ['My music'] },
  };
  global.fetch = jest.fn(async (url) => {
    if (!responses[url]) throw new Error(`Unexpected request: ${url}`);
    return { status: 200, json: async () => responses[url] };
  });

  // Flush all three mocked startup requests before querying the interface.
  await act(async () => {
    render(<App />);
  });

  expect(screen.getByText('Disconnect Spotify')).toBeInTheDocument();
  expect(screen.getByText('Reconnect YouTube')).toBeInTheDocument();
  expect(screen.getByText('Make the move.')).toBeInTheDocument();
  expect(screen.getByText('Spotify playlists').closest('button')).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText('YouTube playlists').closest('button')).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText('Convert to YouTube')).toBeDisabled();
  expect(screen.getByText(/first two tracks/i)).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(3);
});
