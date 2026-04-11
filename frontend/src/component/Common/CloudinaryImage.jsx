import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { AdvancedImage, placeholder } from '@cloudinary/react';
import { CLOUDINARY_CONFIG } from '../../configurations/configuration';

const CloudinaryImage = ({ 
    publicId, 
    type = 'product', 
    width = 500, 
    height = 500, 
    className,
    alt = 'Drumify Image'
}) => {
    if (publicId?.startsWith('http')) {
        const parts = publicId.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1) {
            const pathParts = parts.slice(uploadIndex + 1);
            if (pathParts[0].startsWith('v') && !isNaN(pathParts[0].substring(1))) {
                publicId = pathParts.slice(1).join('/').split('.')[0];
            } else {
                publicId = pathParts.join('/').split('.')[0];
            }
        }
    }

    if (!publicId) return null;

    const cld = new Cloudinary({ 
        cloud: { cloudName: CLOUDINARY_CONFIG.CLOUD_NAME } 
    });

    const img = cld.image(publicId);

    // Apply optimizations
    img.delivery(format('auto')).delivery(quality('auto'));

    // Apply transformations based on type
    if (type === 'avatar') {
        img.resize(
            thumbnail()
                .width(width)
                .height(height)
                .gravity(autoGravity())
        );
    } else {
        img.resize(
            scale()
                .width(width)
                .height(height)
        );
    }

    return (
        <AdvancedImage 
            cldImg={img} 
            className={className} 
            alt={alt}
            plugins={[placeholder({mode: 'blur'})]}
        />
    );
};

export default CloudinaryImage;
