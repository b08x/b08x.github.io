import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';

interface ReactPlayerIslandProps {
    url: string;
    playing?: boolean;
    controls?: boolean;
    width?: string | number;
    height?: string | number;
    [key: string]: any;
}

const ReactPlayerIsland: React.FC<ReactPlayerIslandProps> = ({
    url,
    playing = false,
    controls = true,
    width = '100%',
    height = '100%',
    ...rest
}) => {
    useEffect(() => {
        console.log('[Garden] ReactPlayerIsland mounted', { url, playing, controls, width, height, rest });
        console.log('[Garden] ReactPlayer type:', typeof ReactPlayer);
    }, [url, playing, controls, width, height, rest]);

    const Player = ReactPlayer as any;
    return (
        <div className="react-player-wrapper" style={{ position: 'relative', paddingTop: '56.25%', marginBottom: '1.5rem' }}>
            <Player
                url={url}
                playing={playing}
                controls={controls}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                {...rest}
            />
        </div>
    );
};

export default ReactPlayerIsland;
