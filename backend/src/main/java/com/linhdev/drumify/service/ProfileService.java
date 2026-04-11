package com.linhdev.drumify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.linhdev.drumify.client.IdentityClient;
import com.linhdev.drumify.dto.identity.Credential;
import com.linhdev.drumify.dto.identity.TokenExchangeParam;
import com.linhdev.drumify.dto.identity.UserCreationParam;
import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.response.ProfileResponse;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.exception.ErrorNormalizer;
import com.linhdev.drumify.mapper.ProfileMapper;
import com.linhdev.drumify.repository.ProfileRepository;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    IdentityClient identityClient;
    private final ErrorNormalizer errorNormalizer;

    @Value("${idp.client-id}")
    @NonFinal
    String clientId;

    @Value("${idp.client-secret}")
    @NonFinal
    String clientSecret;

    // Register with custom UI Frontend (optional)
    public ProfileResponse register(RegistrationRequest request) {
        try {
            // Exchange Client Token
            var tokenInfo = identityClient.exchangeToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());

            // Get userId of Keycloak account
            var creationResponse = identityClient.createUser(
                    "Bearer " + tokenInfo.getAccessToken(),
                    UserCreationParam.builder()
                            .username(request.getUsername())
                            .email(request.getEmail())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .emailVerified(false)
                            .enabled(true)
                            .credentials(List.of(Credential.builder()
                                    .type("password")
                                    .temporary(false)
                                    .value(request.getPassword())
                                    .build()))
                            .build());

            // Get UserId from Header
            String userId = extractUserId(creationResponse);

            // Map request to profile
            var profile = profileMapper.toProfile(request);
            profile.setUserId(userId);
            profile.setDob(request.getDob());
            profile.setSex(request.getSex());

            profile = profileRepository.save(profile);

            return profileMapper.toProfileResponse(profile);
        } catch (FeignException e) {
            throw errorNormalizer.handleKeycloakException(e);
        }
    }

    public ProfileResponse getMyProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return profileMapper.toProfileResponse(profile);
    }

    @PreAuthorize(
            """
		hasRole('ADMIN')
		or hasRole('DIRECTOR')
		or (hasRole('STAFF') and hasAuthority('GROUP_HR'))
	""")
    public List<ProfileResponse> getAllProfiles() {
        var profiles = profileRepository.findAll();
        return profiles.stream().map(profileMapper::toProfileResponse).toList();
    }

    public ProfileResponse syncProfile(RegistrationRequest request, String userId) {
        var profile = profileRepository.findByUserId(userId).orElseGet(() -> profileMapper.toProfile(request));

        profile.setUserId(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDob(request.getDob());
        profile.setSex(request.getSex());

        profile = profileRepository.save(profile);

        return profileMapper.toProfileResponse(profile);
    }

    private String extractUserId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").getFirst();
        String[] splitStr = location.split("/");
        return splitStr[splitStr.length - 1];
    }
}
