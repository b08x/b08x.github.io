import React, { useState, useRef, useEffect } from 'react';

const MediaControlBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleBGM = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between border-t border-border bg-surface px-6 z-50">
      <audio
        ref={audioRef}
        src="/assets/audio/jazzyfrenchy.mp3"
        loop
      />
      <div className="flex items-center gap-4">
        <button
          onClick={toggleBGM}
          className="font-mono text-foreground hover:text-accent transition-colors"
          aria-label={isPlaying ? 'Pause BGM' : 'Play BGM'}
        >
          {isPlaying ? '[x] BGM' : '[ ] BGM'}
        </button>
      </div>
      <div className="font-mono text-sm text-muted">
        SYNC_NOTES_PRESENTATION_MODE
      </div>
    </div>
  );
};

export default MediaControlBar;
