import { useRef, useEffect, useState } from "react";

const MusicPlayer = ({ src, volume = 0.3 }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (playing) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, volume]);

  return (
    <button
      className="music-toggle buttons"
      onClick={() => setPlaying((p) => !p)}
      style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
    >
      <audio ref={audioRef} src={src} loop />
      {playing ? "🔊" : "🔇"}
    </button>
  );
};

export default MusicPlayer;