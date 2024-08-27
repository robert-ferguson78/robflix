import React from 'react';
import { useInView } from 'react-intersection-observer';

// Define the props for the EmbedVideo component
interface EmbedVideoProps {
    name: string;
    videoKey: string;
}

// Define the EmbedVideo component
const EmbedVideo: React.FC<EmbedVideoProps> = ({ name, videoKey }) => {
    // Use the useInView hook to detect when the component is in view
    const { ref, inView } = useInView({
        triggerOnce: true, // Load the video only once when it comes into view
        threshold: 0.5, // Adjust the threshold as needed
    });

    // Construct the video URL using the provided video key
    const videoUrl = `https://www.youtube.com/embed/${videoKey}`;

    return (
        <div ref={ref}>
            <h4>{name}</h4>
            {inView && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000' }}>
                    <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src={videoUrl}
                        title={name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default EmbedVideo;