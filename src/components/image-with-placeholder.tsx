import React, { useState, ImgHTMLAttributes } from 'react';

interface ImageWithPlaceholderProps extends ImgHTMLAttributes<HTMLImageElement> {
    placeholderSrc: string | undefined;
    src: string;
    alt: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
    placeholderSrc,
    src,
    alt,
    ...imgProps
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Placeholder */}
            {!loaded && (
                <img
                    src={placeholderSrc}
                    alt="placeholder"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                style={{
                    opacity: loaded ? 1 : 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                {...imgProps}
            />
        </div>
    );
};

export default ImageWithPlaceholder;
