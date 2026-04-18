import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { AdvancedImage, placeholder } from '@cloudinary/react';
import { CLOUDINARY_CONFIG } from '../../configurations/configuration';

const CloudinaryImage = React.memo(({ 
    publicId, 
    type = 'product', 
    width = 500, 
    height = 500, 
    className,
    alt = 'Drumify Image'
}) => {
    const img = React.useMemo(() => {
        if (!publicId) return null;
        
        let parsedId = publicId;
        if (parsedId.startsWith('http')) {
            const parts = parsedId.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1) {
                const pathParts = parts.slice(uploadIndex + 1);
                if (pathParts[0].startsWith('v') && !isNaN(pathParts[0].substring(1))) {
                    parsedId = pathParts.slice(1).join('/').split('.')[0];
                } else {
                    parsedId = pathParts.join('/').split('.')[0];
                }
            }
        }

        const cld = new Cloudinary({ 
            cloud: { cloudName: CLOUDINARY_CONFIG.CLOUD_NAME } 
        });

        const image = cld.image(parsedId);

        // Apply optimizations
        image.delivery(format('auto')).delivery(quality('auto'));

        // Apply transformations based on type
        if (type === 'avatar') {
            image.resize(
                thumbnail()
                    .width(width)
                    .height(height)
                    .gravity(autoGravity())
            );
        } else {
            image.resize(
                scale()
                    .width(width)
                    .height(height)
            );
        }
        
        return image;
    }, [publicId, type, width, height]);

    if (!img) return null;

    return (
        <AdvancedImage 
            cldImg={img} 
            className={className} 
            alt={alt}
            plugins={[placeholder({mode: 'blur'})]}
        />
    );
});

export default CloudinaryImage;
