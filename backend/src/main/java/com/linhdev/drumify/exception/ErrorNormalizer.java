package com.linhdev.drumify.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linhdev.drumify.dto.identity.KeycloakError;

import feign.FeignException;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ErrorNormalizer {
    private final ObjectMapper objectMapper;
    private final Map<String, ErrorCode> errorCodeMap;

    public ErrorNormalizer() {
        this.objectMapper = new ObjectMapper();
        this.errorCodeMap = new HashMap<>();

        errorCodeMap.put("User exists with same username", ErrorCode.USER_EXISTED);
        errorCodeMap.put("User exists with same email", ErrorCode.EMAIL_EXISTED);
        errorCodeMap.put("User name is missing", ErrorCode.USERNAME_IS_MISSING);
    }

    public AppException handleKeycloakException(FeignException e) {
        int status = e.status();
        String body = null;
        try {
            body = e.contentUTF8();
        } catch (Exception ignored) {

        }

        try {
            log.warn("Keycloak request failed. status={}, bodyLength={}", status, body == null ? null : body.length());

            if (body != null && !body.isBlank()) {
                var response = objectMapper.readValue(body, KeycloakError.class);

                String errorMessage = response.getErrorMessage();
                if (Objects.nonNull(errorMessage) && Objects.nonNull(errorCodeMap.get(errorMessage))) {
                    return new AppException(errorCodeMap.get(errorMessage));
                }
            }
        } catch (JsonProcessingException ex) {
            log.warn("Cannot deserialize Keycloak error body. status={}, bodyPreview={}", status, preview(body), ex);
        }

        return new AppException(mapByStatus(status));
    }

    private ErrorCode mapByStatus(int status) {
        return switch (status) {
            case 401 -> ErrorCode.UNAUTHENTICATED;
            case 403 -> ErrorCode.UNAUTHORIZED;
            case 404 -> ErrorCode.RESOURCE_NOT_FOUND;
            default -> ErrorCode.EXTERNAL_SERVICE_ERROR;
        };
    }

    private String preview(String body) {
        if (body == null) return null;
        String trimmed = body.trim();
        if (trimmed.length() <= 300) return trimmed;
        return trimmed.substring(0, 300) + "...(truncated)";
    }
}
