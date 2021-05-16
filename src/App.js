import React, { useState, useRef } from "react";
import "./styles/app.scss";
import Player from "./components/Player";
import Song from "./components/Song";
import Nav from "./components/Nav";
import data from "./data";

import Library from "./components/Library";

function App() {
  //ref
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(data()); //grabs all songs  used for selecting and setting song in library ui
  const [currentSong, setCurrentSong] = useState(songs[0]); // get current song
  const [isPlaying, setIsPlaying] = useState(false); // check to see if song is playing or paused
  // Time State infor
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
    volume: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false); // will turn on or off the library ui
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true, //change the active state of the selected song to true
        };
      } else {
        return {
          ...song,
          active: false, //change the active state of the songs not selected to false
        };
      }
    });

    setSongs(newSongs);
  }

  const timeUpdateHandler = (e) => {
    // get current time and duration time of the song using onTimeUpdate
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //calculate percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animationPercentage = Math.round(
      (roundedCurrent / roundedDuration) * 100
    );

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage,
      volume: e.target.volume,
    }); // since you're periodaclly updating use spread operator because songinfo is an object
  };

  const songEndHandler = async () => { // when at end of song to next song and play
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id); //check if song id matches current song id and grab its index
    await setCurrentSong(songs[currentIndex + 1]); // go to next song
    activeLibraryHandler(songs[currentIndex + 1]);
    if(isPlaying) audioRef.current.play();
  };

  return (
    <div className={`App ${libraryStatus ? 'library-active' : "" }`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying}/>
      <Player
        activeLibraryHandler={activeLibraryHandler}
        setSongs={setSongs}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setCurrentSong={setCurrentSong}
      />
      <Library
        libraryStatus={libraryStatus}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
        isPlaying={isPlaying}
        setSongs={setSongs}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
