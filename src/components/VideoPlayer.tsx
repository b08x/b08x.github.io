import React, { useState, useRef, useEffect } from 'react';

interface Action {
    timestamp: number;
    description: string;
    completed?: boolean;
}

interface Segment {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    actions: Action[];
}

interface TranscriptItem {
    timestamp: number;
    text: string;
}

interface VideoPlayerProps {
    videoUrl: string;
    segments: Segment[];
    transcript?: TranscriptItem[];
    title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    segments,
    transcript = [],
    title = "Video Tutorial"
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
    const [activeAction, setActiveAction] = useState<Action | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Update current time as video plays
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, []);

    // Determine active segment and action based on current time
    useEffect(() => {
        const current = segments.find(
            seg => currentTime >= seg.startTime && currentTime < seg.endTime
        );
        setActiveSegment(current || null);

        if (current) {
            // Find the most recent action that has passed
            const recentAction = [...current.actions]
                .reverse()
                .find(action => currentTime >= action.timestamp);
            setActiveAction(recentAction || null);
        } else {
            setActiveAction(null);
        }
    }, [currentTime, segments]);

    const jumpToTime = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const changePlaybackRate = (rate: number) => {
        setPlaybackRate(rate);
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    };

    const filteredTranscript = transcript.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="video-player-container" style={{
            display: 'flex',
            gap: 'var(--spacing-6)',
            flexDirection: 'row',
            minHeight: '600px'
        }}>
            {/* Left Panel - Video */}
            <div style={{
                flex: '0 0 60%',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)'
            }}>
                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-4)'
                }}>
                    <h2 style={{
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--spacing-3)',
                        fontSize: '1.25rem',
                        fontWeight: 600
                    }}>
                        {title}
                    </h2>

                    <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        style={{
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            background: '#000'
                        }}
                    />

                    {/* Playback Controls */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-3)',
                        marginTop: 'var(--spacing-3)',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}>
                            Speed:
                        </span>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                            <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                style={{
                                    padding: 'var(--spacing-2) var(--spacing-3)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    background: playbackRate === rate ? 'var(--link-base)' : 'var(--surface)',
                                    color: playbackRate === rate ? '#fff' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    transition: 'all 150ms'
                                }}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>

                    {/* Current Time Display */}
                    <div style={{
                        marginTop: 'var(--spacing-3)',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.875rem'
                    }}>
                        Current: {formatTime(currentTime)}
                        {activeSegment && (
                            <span style={{ marginLeft: 'var(--spacing-2)' }}>
                                • {activeSegment.title}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Actions & Transcript */}
            <div style={{
                flex: '0 0 40%',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)'
            }}>
                {/* Current Actions */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-4)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-3)'
                    }}>
                        Actionable Steps
                    </h3>

                    {activeSegment ? (
                        <div>
                            <div style={{
                                color: 'var(--link-base)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                marginBottom: 'var(--spacing-3)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {activeSegment.title}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                                {activeSegment.actions.map((action, idx) => {
                                    const isPast = action.timestamp < currentTime;
                                    const isCurrent = action === activeAction;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => jumpToTime(action.timestamp)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--spacing-2)',
                                                padding: 'var(--spacing-2)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                background: isCurrent ? 'var(--ui-hover)' : 'transparent',
                                                border: isCurrent ? '1px solid var(--link-base)' : '1px solid transparent',
                                                transition: 'all 150ms'
                                            }}
                                        >
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: `2px solid ${isPast ? 'var(--link-base)' : 'var(--border)'}`,
                                                background: isPast ? 'var(--link-base)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                marginTop: '2px'
                                            }}>
                                                {isPast && (
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                                {isCurrent && !isPast && (
                                                    <div style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: 'var(--link-base)',
                                                        animation: 'pulse 2s ease-in-out infinite'
                                                    }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.875rem',
                                                    fontWeight: isCurrent ? 600 : 400
                                                }}>
                                                    {action.description}
                                                </div>
                                                <div style={{
                                                    color: 'var(--text-tertiary)',
                                                    fontSize: '0.75rem',
                                                    marginTop: '2px',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {formatTime(action.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            padding: 'var(--spacing-4)'
                        }}>
                            Play the video to see actionable steps
                        </div>
                    )}
                </div>

                {/* Transcript */}
                {transcript.length > 0 && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-4)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h3 style={{
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: 'var(--spacing-3)'
                        }}>
                            Full Transcript
                        </h3>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search transcript..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-2)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                marginBottom: 'var(--spacing-3)'
                            }}
                        />

                        {/* Transcript Items */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-2)'
                        }}>
                            {filteredTranscript.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => jumpToTime(item.timestamp)}
                                    style={{
                                        padding: 'var(--spacing-2)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        background: Math.abs(currentTime - item.timestamp) < 2
                                            ? 'var(--ui-hover)'
                                            : 'transparent',
                                        transition: 'background 150ms'
                                    }}
                                >
                                    <div style={{
                                        color: 'var(--link-base)',
                                        fontSize: '0.75rem',
                                        fontFamily: 'monospace',
                                        marginBottom: '4px'
                                    }}>
                                        [{formatTime(item.timestamp)}]
                                    </div>
                                    <div style={{
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.5
                                    }}>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default VideoPlayer;