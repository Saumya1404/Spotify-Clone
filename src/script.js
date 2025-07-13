console.log("Hello");
    let currentsong=new Audio();
    let songs
    let currfolder
function goToHome(){
    window.location.href="index.html"
}
function redirect(){
    window.location.href = "logout.html";
}

async function getSongs(folder) {
    currfolder=folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]))
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="svg/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Yorushika</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="svg/play.svg" alt="">
                            </div> </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
        } else {
            currentsong.pause();
        }
        togglePlayPauseIcon();
    }); 
    return songs
    
}
function togglePlayPauseIcon() {
    if (currentsong.paused) {
        play.src = "svg/play.svg";
    } else {
        play.src = "svg/pause.svg";
    }
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic=(track,pause=false)=>{
   currentsong.src=`/${currfolder}/` + track
   if (!pause){
    currentsong.play()
}
    play.src="svg/pause.svg"
    document.querySelector(".songinfo").innerHTML=(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function main(){
   songs= await getSongs('songs');
    playMusic(songs[0],true)

    document.getElementById("logoutButton").addEventListener("click", redirect);
  
   currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}:
        ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%";
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })
    prev.addEventListener("click",()=>{
        console.log("previous clicked")
        let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").slice(-1)[0]))
        if((index-1)>=0){
            playMusic(songs[index-1])
    }
    })
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").slice(-1)[0]))
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    
    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("svg/mute.svg", "svg/volume.svg")
        }
    })
    Array.from(document.getElementsByClassName("play")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
    currentsong.addEventListener("ended", () => {
        let currentIndex = songs.indexOf(decodeURIComponent(currentsong.src.split("/").slice(-1)[0]));
        let nextIndex = currentIndex + 1;
        if (nextIndex < songs.length) {
            playMusic(songs[nextIndex]);
        } else {
            currentsong.pause();
            currentsong.currentTime = 0;
            togglePlayPauseIcon();
        }
    });
    


}

main()