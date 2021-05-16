import React from "react";
//This file just display song title, picture, mp3 file

const Song = ({ currentSong,isPlaying }) => {
  console.log(isPlaying);
  return (
    <div className="song-container">
      <div className="song-cover">
        <img className={isPlaying === true ? 'spinning' : ''} alt={currentSong.name} src={currentSong.cover} />
        <h2>{currentSong.name}</h2>
        <h3>{currentSong.artist}</h3>
      </div>
    </div>
  );
};

export default Song;
