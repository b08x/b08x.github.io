import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title = "Audio Overview" }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player-container bg-surface rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold mb-3 text-foreground">
        Audio Overview
      </h3>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
        {title}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, var(--border) ${progress}%, var(--border) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-accent hover:bg-accent/80 text-white rounded-full transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex gap-1">
          {[0.75, 1, 1.25, 1.5, 2].map(rate => (
            <button
              key={rate}
              onClick={() => changePlaybackRate(rate)}
              className={`
                px-2 py-1 text-xs rounded transition-colors border
                ${playbackRate === rate
                  ? 'bg-accent border-accent text-white'
                  : 'bg-background border-border text-foreground/60 hover:bg-accent/10 hover:border-accent/30'
                }
              `}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
