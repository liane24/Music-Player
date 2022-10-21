//Selecting and modifying elements
const container = document.querySelector(".container"),
songImage = container.querySelector(".img-area img"),
songName = container.querySelector(".song-info .name"),
songArtist = container.querySelector(".song-info .artist"),
songMP3 = container.querySelector("#audioPlayer"),
mainBtn = container.querySelector(".play_pause"),
prevBtn = container.querySelector("#previous-song"),
nextBtn = container.querySelector("#next-song"),
progressBar = container.querySelector(".progressBar"),
progress = container.querySelector(".progress"),
musicLibrary = container.querySelector(".music-library"),
repeatBtn = container.querySelector("#repeat-song"),
showLibrary = container.querySelector("#more-songs"),
hideLibrary = musicLibrary.querySelector("#hide");



let indexMusic = 6;

window.addEventListener("load", () => {
    loadSongs(indexMusic); //This calls the loadSongs function once window has been loaded
    currentlyPlaying();
})

//loadSongs function
function loadSongs(indexNumber) {
    songName.innerText = allSongs[indexNumber - 1].name;
    songArtist.innerText = allSongs[indexNumber - 1].artist;
    songImage.src = `images/${allSongs[indexNumber - 1].img}.jpg`;
    songMP3.src = `songs/${allSongs[indexNumber - 1].src}.mp3`;
}

//playSong function
function playSong(){
    container.classList.add("paused");
    mainBtn.querySelector("i").innerText = "pause";
    songMP3.play();
}

//pauseSong function
function pauseSong(){
    container.classList.remove("paused");
    mainBtn.querySelector("i").innerText = "play_arrow";
    songMP3.pause();
}

//play song event
mainBtn.addEventListener("click", () => {
    const isSongPaused = container.classList.contains("paused");
    //if 'isSongPaused' is true then call 'pauseSong', else call playSong
    isSongPaused ? pauseSong() : playSong();
})

//nextSong function which increments index by 1
function nextSong() {
    indexMusic++;
    //If indexMusic is greater than the array length then indexMusic will be 1 so that the first song will play
    indexMusic > allSongs.length ? indexMusic = 1 : indexMusic = indexMusic;
    loadSongs(indexMusic);
    playSong();
}

//prevSong function which decrements index by 1
function prevSong() {
    indexMusic--;
    //If indexMusic is less than 1 then indexMusic will be array length so the last song will play
    indexMusic < 1 ? indexMusic = allSongs.length : indexMusic = indexMusic;
    loadSongs(indexMusic);
    playSong();
}

//next song event
nextBtn.addEventListener("click", () => {
    nextSong(); //calling next song function
})

//previous song event
prevBtn.addEventListener("click", () => {
    prevSong(); //calling previous song function
})

//update progress bar width according to current time
songMP3.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting the current time of song
    const duration = e.target.duration; //getting duration of song
    let progressBarWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;
    
    let songCurrentTime = container.querySelector(".current"),
    songDuration = container.querySelector(".duration");

    songMP3.addEventListener("loadeddata", () => {
        //update song total duration
        let musicDuration = songMP3.duration;
        let totalMinutes = Math.floor(musicDuration / 60);
        let totalSeconds = Math.floor(musicDuration % 60);
        if(totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;
        }
        songDuration.innerText = `${totalMinutes} : ${totalSeconds}`;
    });
        //update current song time
        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if(currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        songCurrentTime.innerText = `${currentMinutes} : ${currentSeconds}`;
    
    });

    //updates progress bar according to current length of song
    progress.addEventListener("click", (e) => {
        let barWidth = progress.clientWidth; //gets witdh of the progress bar
        let clickOffSetX = e.offsetX; //gets offset x value
        let audioDuration = songMP3.duration; //getts total of song duration
        
        songMP3.currentTime = (clickOffSetX / barWidth) * audioDuration;
        
    });

    //loop, shuffle, repeat icons
    repeatBtn.addEventListener("click", () => {
        //innerText of the repeat icon
        let icon = repeatBtn.innerText;
        //switch statements
        switch(icon) {
            case "repeat": //if this icon is 'repeat' then switch to 'repeat_one (google icon)'
                repeatBtn.innerText = "repeat_one";
                repeatBtn.setAttribute("title", "Song repeated")
                break;
            case "repeat_one": //if this icon is 'repeat_one' then switch to 'shuffle'
                repeatBtn.innerText = "shuffle";
                repeatBtn.setAttribute("title", "Shuffle enabled")
                break;
            case "shuffle": //if icon is 'shuffle' then switch to 'repeat'
                repeatBtn.innerText = "repeat";
                repeatBtn.setAttribute("title", "Playlist looped")
                break;
        }

    });

    songMP3.addEventListener("ended", () => {
        let icon = repeatBtn.innerText;
        switch(icon) {
            case "repeat": //if this icon is 'repeat' then the nextSong function will be called
                nextSong();
                break;
            case "repeat_one": //if this icon is 'repeat_one' then the songs current time will be 0 so that the song can from the beginning
                songMP3.currentTime = 0;
                loadSongs(indexMusic);
                playSong();
                break;
            case "shuffle":
                let randomNumber = Math.floor((Math.random() * allSongs.length) + 1); //Generates a random number between the max range of the length of array
                do {
                    randomNumber = Math.floor((Math.random() * allSongs.length) + 1); 
                } while(indexMusic == randomNumber); //loop will run until the next random number is he same as the current indexMusic
                indexMusic = randomNumber; //passes randomNumber to indexMusic so a random song will play
                loadSongs(indexMusic); //calls loadSongs function
                playSong(); //calls playSong function
                break;
        }

    });

    showLibrary.addEventListener("click", () => {
        musicLibrary.classList.toggle("show");
    });
    
    hideLibrary.addEventListener("click", () => {
       showLibrary.click();
    });

    const ulTag = container.querySelector("ul");
    for(let i = 0; i < allSongs.length; i++) {
        //passes name of song, artist and song duration from the allSongs array
        //audio tag to calculate total duration if the music in the list
        //li-index finds which song is currently playing
        let liTag = `<li li-index="${i + 1}">
                        <div class="row">
                          <span>${allSongs[i].name}</span> 
                          <p>${allSongs[i].artist}<p>
                          </div>
                          <span id="${allSongs[i].src}" class="audioLength">3:40</span>
                          <audio class="${allSongs[i].src}" src="songs/${allSongs[i].src}.mp3"></audio>
                          
                        </li>`;
        ulTag.insertAdjacentHTML("beforeend", liTag); //This method inserts a text as HTML in teh specified position (before the end of the element)

        let liAudioLength = ulTag.querySelector(`#${allSongs[i].src}`); //selects span tag which shows the audio total duration of thesongs
        let liAudioTag = ulTag.querySelector(`.${allSongs[i].src}`); //selects audio tat

        liAudioTag.addEventListener("loadeddata", () => { //audio duration
            let duration = liAudioTag.duration;
            let totalMinutes = Math.floor(duration / 60);
            let totalSeconds = Math.floor(duration % 60);
            if(totalSeconds < 10) {
            totalSeconds = `0${totalSeconds}`;
        };
        liAudioLength.innerText = `${totalMinutes} : ${totalSeconds}`;
    });
}
    
//Playing music from the list
const allLiTags = ulTag.querySelectorAll("li");
function currentlyPlaying() {
for(let j = 0; j < allLiTags.length; j++) {

    //removes colour of song that was last active
    if(allLiTags[j].classList.contains("playing")) {
        allLiTags[j].classList.remove("playing");
    }
    //gets the song that is cuurently playing when there is a ly tag when li-index is equal to indexMusic
    if(allLiTags[j].getAttribute("li-index") == indexMusic) {
        allLiTags[j].classList.add("playing");
    }
    //adds onclick attribute to all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
}
}
    //Plays sing onclick
    function clicked(element){
        let getIndexLiTag = element.getAttribute("li-index");
        indexMusic = getIndexLiTag; //passes that li-index to indexMusic
        loadSongs(indexMusic);
        playSong();
        currentlyPlaying();
    }

    
  
    



    