package com.linhdev.drumify.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.linhdev.drumify.constant.CloudinaryFolderConstants;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaService {

    private final Cloudinary cloudinary;

    public String storeProfileMedia(MultipartFile file) {
        return uploadToCloudinary(file, CloudinaryFolderConstants.PROFILE_MEDIA_FOLDER);
    }

    @Async("taskExecutor")
    public void deleteProfileMedia(String url) {
        deleteFromCloudinary(url);
    }

    private String uploadToCloudinary(MultipartFile file, String folder) {
        try {
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", folder);
            uploadParams.put("use_filename", false);
            uploadParams.put("unique_filename", true);
            uploadParams.put("overwrite", false);
            uploadParams.put("resource_type", "auto");

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult =
                    (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), uploadParams);

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            log.info("File uploaded to Cloudinary. Folder: {}, Public ID: {}, URL: {}", folder, publicId, url);
            return url;
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void deleteFromCloudinary(String url) {
        if (url == null || url.isBlank()) {
            return;
        }

        if (!url.contains("cloudinary.com")) {
            log.debug("URL is not a Cloudinary URL, skipping deletion: {}", url);
            return;
        }

        try {
            String publicId = extractPublicIdFromUrl(url);
            if (publicId == null || publicId.isBlank()) {
                log.warn("Could not extract public_id from Cloudinary URL: {}", url);
                return;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> deleteResult =
                    (Map<String, Object>) cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String result = (String) deleteResult.get("result");

            if ("ok".equals(result)) {
                log.info("File deleted from Cloudinary. Public ID: {}", publicId);
            } else {
                log.warn("Failed to delete file from Cloudinary. Public ID: {}, Result: {}", publicId, result);
            }
        } catch (Exception e) {
            log.warn("Error deleting file from Cloudinary. URL: {}, Error: {}", url, e.getMessage());
        }
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) {
                return null;
            }

            String pathAfterUpload = url.substring(uploadIndex + "/upload/".length());

            if (pathAfterUpload.startsWith("v") && pathAfterUpload.indexOf('/') > 0) {
                int versionEndIndex = pathAfterUpload.indexOf('/');
                pathAfterUpload = pathAfterUpload.substring(versionEndIndex + 1);
            }

            while (pathAfterUpload.matches("^[^/]+_[^/]+/.*") || pathAfterUpload.matches("^[^/]+,[^/]+/.*")) {
                int slashIndex = pathAfterUpload.indexOf('/');
                if (slashIndex > 0) {
                    pathAfterUpload = pathAfterUpload.substring(slashIndex + 1);
                } else {
                    break;
                }
            }

            int lastDot = pathAfterUpload.lastIndexOf('.');
            if (lastDot > 0) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDot);
            }

            return pathAfterUpload;
        } catch (Exception e) {
            log.warn("Error extracting public_id from URL {}: {}", url, e.getMessage());
            return null;
        }
    }
}
