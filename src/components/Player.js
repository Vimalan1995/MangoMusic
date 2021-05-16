import React, {useState}  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPause,
  faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  songs,
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  setCurrentSong,
  setSongs,
  activeLibraryHandler
}) => {
  //use effct
 // run this function when ever current song gets updated
  //volume
  const [activeVolume, setActiveVolume] = useState(false);
  //event handlers
  const playSongHandler = () => {
    //plays the current song which audi is ref to.
    //user reference to get specific html component
    if (isPlaying) {
      // if song is playing
      audioRef.current.pause(); // pause
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const getTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const secondsWithZero = String(seconds).padStart(2, "0");
    return `${minutes}:${secondsWithZero}`;
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value; // this will update the audio aswell
    setSongInfo({ ...songInfo, currentTime: e.target.value }); // lets you drag the song bar to certain times
  };

  const skipTrackHandler = async(direction) => {
    //grab index first to determine where yo uare in the song
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id); //check if song id matches current song id and grab its index

    if (direction === "skip-forward") {
      if (currentIndex === songs.length - 1) {
        // if the current song is the last song
        await setCurrentSong(songs[0]); // set the current song to the first song so it does not go out of bouns
        activeLibraryHandler(songs[0]);
      } else {
        await setCurrentSong(songs[currentIndex + 1]); // go to next song
        activeLibraryHandler(songs[currentIndex + 1]);
      }
    }

    if (direction === "skip-back") {
      if (currentIndex === 0) {
        await setCurrentSong(songs[songs.length - 1]); //if the current song is the first song, set it to the last song
        activeLibraryHandler(songs[songs.length - 1]);
      } else {
        await setCurrentSong(songs[currentIndex - 1]); // go to previous song
        activeLibraryHandler(songs[currentIndex - 1]);
      }
    }
    // playAudio(isPlaying, audioRef);
    if(isPlaying) audioRef.current.play();
  };
  //Add styles
  const trackAnim ={
    transform: `translateX(${songInfo.animationPercentage}%)`
  }

  const changeVolume = (e) => {
    let value = e.target.value;
    audioRef.current.volume = value;
    setSongInfo({...songInfo, volume: value})
  }

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div style={{background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`}} className="track">
          {/* picks up color of current song and make gradient out of it */}
          <input
            min={0}
            max={songInfo.duration}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>

        {/* // add || 0 to remove the NaN the loads up when you switch to a different song */}
        <p>{getTime(songInfo.duration || 0)}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleDoubleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleDoubleRight}
        />
        <FontAwesomeIcon
        className ="volume"
        onClick={()=>setActiveVolume(!activeVolume)}
        icon={faVolumeDown}
         />
        {activeVolume && (
          <input 
          onChange={changeVolume}
          value={songInfo.volume}
          max="1"
          min="0"
          step="0.01"
          type="range"/>
        )}
      </div>
    </div>
  );
};

export default Player;
