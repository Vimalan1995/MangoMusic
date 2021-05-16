import React from "react";

//This file just display song title, picture, mp3 file

const LibrarySongs = ({
  songs,
  song,
  setCurrentSong,
  id,
  key,
  audioRef,
  isPlaying,
  setSongs,
}) => {
  const songSelectHandler = async () => {
    // this will need all the songs make sure to pass that down
    await setCurrentSong(song);
    //add active state
    const newSongs = songs.map((song) => {
      if (song.id === id) {
        return {
          ...song,
          active: true, //change the active state of the selected song to true
        };
      }else{
        return{
          ...song,
          active:false, //change the active state of the songs not selected to false
        }
      }
    });
    await setSongs(newSongs);
    if(isPlaying) audioRef.current.play();

    //check if song is playing
  //   if (isPlaying) {
  //     const playPromise = audioRef.current.play();
  //     if (playPromise !== undefined) {
  //       playPromise.then((audio) => {
  //         audioRef.current.play();
  //       });
  //     }
  //   }
   };

  return (
    <div
      onClick={songSelectHandler}
      className={`library-song ${song.active ? "selected" : ""}`}
    >
      <img alt="" src={song.cover} />

      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySongs;
