import { CLOUDINARY_CONFIG } from "../configurations/configuration";

export const uploadToCloudinary = async (file, folderPath) => {
    if (!file) return null;

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
        formData.append("folder", folderPath);

        const response = await fetch(
            `${CLOUDINARY_CONFIG.UPLOAD_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/auto/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const uploadAvatar = async (file) => {
    return uploadToCloudinary(file, "drumify/users/avatars");
};

const imageService = {
    uploadToCloudinary,
    uploadAvatar
};

export default imageService;
