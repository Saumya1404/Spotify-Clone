# Spotify-like Music Player

A modern, Spotify-inspired web music player with Node.js backend and dynamic frontend.

## Features
- Spotify-like UI: sidebar, playlists, song list, and playbar
- Dynamic playlist and song fetching from backend
- Play, pause, next, previous, and volume controls
- Responsive design for desktop and mobile
- Works with Node.js backend and any static server (e.g., Live Server)

## Project Structure
```
project/
  backend/         # Node.js backend (Express API, static file serving)
  public/          # Frontend static files (HTML, SVG, audio, images)
  src/             # Frontend JS and CSS
  package.json     # (optional) for backend dependencies
  README.md        # This file
```

## Getting Started

### 1. Install Backend Dependencies
```
cd backend
npm install
```

### 2. Start the Backend Server
```
node index.js
```
The backend runs at `http://localhost:3001` by default.

### 3. Start the Frontend
- **Option 1:** Let the backend serve the frontend. Open [http://localhost:3001](http://localhost:3001)
- **Option 2:** Use Live Server or similar to serve `public/index.html` (default port 5500)

### 4. Using the App
- Browse playlists and songs
- Use the playbar to control playback
- Adjust volume and seek
- Works on desktop and mobile

## Customization
- Add your own `.mp3` files to `public/songs/playlistName/`
- Update playlist cover images in `src/script.js` (`playlistCovers` object)

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Node.js, Express

## License
MIT 