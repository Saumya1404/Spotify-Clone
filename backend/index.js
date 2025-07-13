const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

const songsDir = path.join(__dirname, '../public/songs');

// Get all playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await fs.readdir(songsDir);
    // Only directories
    const result = [];
    for (const playlist of playlists) {
      const fullPath = path.join(songsDir, playlist);
      if ((await fs.stat(fullPath)).isDirectory()) {
        result.push(playlist);
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read playlists' });
  }
});

// Get all songs in a playlist
app.get('/api/songs/:playlist', async (req, res) => {
  const playlist = req.params.playlist;
  const playlistPath = path.join(songsDir, playlist);
  try {
    if (!(await fs.pathExists(playlistPath))) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    const files = await fs.readdir(playlistPath);
    // Only mp3 files
    const songs = files.filter(f => f.endsWith('.mp3')).map(f => ({
      title: f,
      url: `/songs/${playlist}/${encodeURIComponent(f)}`
    }));
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read songs' });
  }
});

// List all songs in the root songs directory (not in a playlist)
app.get('/api/songs', async (req, res) => {
  try {
    const files = await fs.readdir(songsDir);
    const songs = [];
    for (const file of files) {
      const fullPath = path.join(songsDir, file);
      if ((await fs.stat(fullPath)).isFile() && file.endsWith('.mp3')) {
        songs.push({
          title: file,
          url: `/songs/${encodeURIComponent(file)}`
        });
      }
    }
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read songs' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
}); 