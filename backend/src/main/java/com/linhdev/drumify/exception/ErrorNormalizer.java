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
        try {
            log.warn("Cannot complete request");
            var response = objectMapper.readValue(e.contentUTF8(), KeycloakError.class);

            String errorMessage = response.getError();
            if (Objects.nonNull(errorMessage) && Objects.nonNull(errorCodeMap.get(errorMessage))) {
                return new AppException(errorCodeMap.get(errorMessage));
            }
        } catch (JsonProcessingException ex) {
            log.error("Cannot deserialize content", ex);
        }

        return new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
    }
}
