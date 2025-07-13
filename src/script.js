console.log("Hello");
    let currentsong=new Audio();
    let songs
    let currfolder
    let activePlaylist = null;
    let activeSong = null;
    let currentSongIndex = 0;

function goToHome(){
    window.location.href="index.html"
}
function redirect(){
    window.location.href = "logout.html";
}

// Initialize all playbar controls
function initializePlaybarControls() {
    // Logout button
    document.getElementById("logoutButton").addEventListener("click", redirect);

    // Play/Pause button
    document.getElementById("play").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
        } else {
            currentsong.pause();
        }
        togglePlayPauseIcon();
    });

    // Previous button
    document.getElementById("prev").addEventListener("click", () => {
        if (songs && currentSongIndex > 0) {
            playSongByIndex(currentSongIndex - 1);
        }
    });

    // Next button
    document.getElementById("next").addEventListener("click", () => {
        if (songs && currentSongIndex < songs.length - 1) {
            playSongByIndex(currentSongIndex + 1);
        }
    });

    // Volume slider
    const volumeSlider = document.querySelector(".volume-slider");
    volumeSlider.addEventListener("input", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    });

    // Audio event listeners
    currentsong.addEventListener("ended", () => {
        if (songs && currentSongIndex < songs.length - 1) {
            playSongByIndex(currentSongIndex + 1);
        } else {
            currentsong.pause();
            currentsong.currentTime = 0;
            togglePlayPauseIcon();
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        const currentTime = secondsToMinutesSeconds(currentsong.currentTime);
        const totalTime = secondsToMinutesSeconds(currentsong.duration);
        document.querySelector(".songtime").textContent = `${currentTime} / ${totalTime}`;
    });

    currentsong.addEventListener("loadedmetadata", () => {
        const totalTime = secondsToMinutesSeconds(currentsong.duration);
        document.querySelector(".songtime").textContent = `00:00 / ${totalTime}`;
    });
}

const BACKEND_URL = "http://localhost:3001";

// Example playlist cover images (can be improved to fetch from backend or use defaults)
const playlistCovers = {
    playlist1: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebe62cff9c6018ae5616b01eab/2/en/default",
    more: "https://i.scdn.co/image/ab67616d00001e0218b1145d9883e5b140151fa9",
    playlist3: "https://i.scdn.co/image/ab67616d00001e020fc9f40ffa270f17b66bcdac",
    playlist4: "https://wrapped-images.spotifycdn.com/image/yts-2023/default/your-top-songs-2023_DEFAULT_en.jpg",
    playlist5: "https://i.scdn.co/image/ab67706f0000000285a267af7eab188ae99105ad"
};

async function getPlaylists() {
    const loading = document.getElementById('playlist-loading');
    const error = document.getElementById('playlist-error');
    loading.style.display = '';
    error.style.display = 'none';
    try {
        const res = await fetch(`${BACKEND_URL}/api/playlists`);
        if (!res.ok) throw new Error('Failed to fetch playlists');
        const playlists = await res.json();
        loading.style.display = 'none';
        return playlists;
    } catch (err) {
        loading.style.display = 'none';
        error.textContent = err.message;
        error.style.display = '';
        return [];
    }
}

async function getSongs(playlist) {
    const loading = document.getElementById('songlist-loading');
    const error = document.getElementById('songlist-error');
    loading.style.display = '';
    error.style.display = 'none';
    try {
        const res = await fetch(`${BACKEND_URL}/api/songs/${playlist}`);
        if (!res.ok) throw new Error('Failed to fetch songs');
        const songs = await res.json();
        loading.style.display = 'none';
        return songs;
    } catch (err) {
        loading.style.display = 'none';
        error.textContent = err.message;
        error.style.display = '';
        return [];
    }
}

function renderPlaylists(playlists) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'card';
        card.tabIndex = 0;
        card.innerHTML = `
            <img class="playlist-cover" src="${playlistCovers[playlist] || 'svg/playlist.svg'}" alt="Playlist Cover">
            <div class="playlist-title">${playlist}</div>
            <button class="card-play-btn"><img src="svg/play.svg" alt="Play"></button>
        `;
        card.addEventListener('click', async (e) => {
            if (e.target.closest('.card-play-btn')) {
                setActivePlaylist(card);
                await loadSongs(playlist, true);
            } else {
                setActivePlaylist(card);
                await loadSongs(playlist, false);
            }
        });
        card.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                setActivePlaylist(card);
                await loadSongs(playlist, true);
            }
        });
        container.appendChild(card);
    });
}

function setActivePlaylist(card) {
    if (activePlaylist) activePlaylist.classList.remove('active');
    card.classList.add('active');
    activePlaylist = card;
}

async function loadSongs(playlist, playFirst = false) {
    currfolder = `songs/${playlist}`;
    songs = await getSongs(playlist);
    const songUL = document.querySelector('.songlist');
    songUL.innerHTML = '';
    songs.forEach((song, i) => {
        const li = document.createElement('li');
        li.className = 'song-row';
        li.innerHTML = `
            <span class="song-title">${song.title.replace(/%20/g, ' ')}</span>
            <button class="song-play-btn"><img src="svg/play.svg" alt="Play"></button>
        `;
        li.addEventListener('click', (e) => {
            if (e.target.closest('.song-play-btn')) {
                playSongByIndex(i);
            } else {
                setActiveSong(li);
                playSongByIndex(i);
            }
        });
        songUL.appendChild(li);
    });
    if (songs.length > 0) {
        setActiveSong(songUL.querySelector('li'));
        if (playFirst) playSongByIndex(0);
    }
}

function setActiveSong(li) {
    if (activeSong) activeSong.classList.remove('active');
    li.classList.add('active');
    activeSong = li;
}

function togglePlayPauseIcon() {
    const playBtn = document.querySelector("#play img");
    if (currentsong.paused) {
        playBtn.src = "svg/play.svg";
    } else {
        playBtn.src = "svg/pause.svg";
    }
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function playSongByIndex(index) {
    if (!songs || index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    const playlist = currfolder.split('/')[1];
    const track = songs[index].title;
    currentsong.src = `${BACKEND_URL}/songs/${playlist}/${encodeURIComponent(track)}`;
    currentsong.play();
    document.querySelector('.songinfo').textContent = track.replace(/%20/g, ' ');
    document.querySelector('.songtime').textContent = '00:00 / 00:00';
    // Highlight active song
    document.querySelectorAll('.songlist li').forEach((li, i) => {
        if (i === index) li.classList.add('active');
        else li.classList.remove('active');
    });
    togglePlayPauseIcon();
}

async function main() {
    // Initialize playbar controls first
    initializePlaybarControls();
    
    const playlists = await getPlaylists();
    renderPlaylists(playlists);
    if (playlists.length > 0) {
        setActivePlaylist(document.querySelector('.card-container .card'));
        await loadSongs(playlists[0], false);
    }
}

main();