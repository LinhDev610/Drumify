import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpCient";
import keycloak from "../keycloak";

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    try {
        const formData = new FormData();
        formData.append("files", file);

        const response = await httpClient.post(API.MEDIA_UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.data?.result && response.data.result.length > 0) {
            return response.data.result[0];
        }

        throw new Error("Cloudinary upload failed: No URL returned");
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

const imageService = {
    uploadToCloudinary,
};

export default imageService;
