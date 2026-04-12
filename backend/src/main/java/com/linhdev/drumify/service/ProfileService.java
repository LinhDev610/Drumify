package com.linhdev.drumify.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linhdev.drumify.client.IdentityClient;
import com.linhdev.drumify.dto.identity.Credential;
import com.linhdev.drumify.dto.identity.TokenExchangeParam;
import com.linhdev.drumify.dto.identity.UserCreationParam;
import com.linhdev.drumify.dto.request.AddressRequest;
import com.linhdev.drumify.dto.request.PasswordChangeRequest;
import com.linhdev.drumify.dto.request.ProfileUpdateRequest;
import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.response.AddressResponse;
import com.linhdev.drumify.dto.response.ProfileResponse;
import com.linhdev.drumify.entity.Address;
import com.linhdev.drumify.entity.Profile;
import com.linhdev.drumify.exception.AppException;
import com.linhdev.drumify.exception.ErrorCode;
import com.linhdev.drumify.exception.ErrorNormalizer;
import com.linhdev.drumify.mapper.AddressMapper;
import com.linhdev.drumify.mapper.ProfileMapper;
import com.linhdev.drumify.repository.AddressRepository;
import com.linhdev.drumify.repository.ProfileRepository;

import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
@Slf4j
public class ProfileService {
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;
    AddressRepository addressRepository;
    AddressMapper addressMapper;
    IdentityClient identityClient;
    MediaService mediaService;
    private final ErrorNormalizer errorNormalizer;

    @Value("${app.default-avatar:}")
    @NonFinal
    String defaultAvatarUrl;

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

    public ProfileResponse updateMyProfile(ProfileUpdateRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String oldAvatarUrl = profile.getAvatarUrl();
        String newAvatarUrl = request.getAvatarUrl();

        profileMapper.updateProfile(profile, request);

        if (newAvatarUrl != null && !newAvatarUrl.equals(oldAvatarUrl)) {
            if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty() && !oldAvatarUrl.equals(defaultAvatarUrl)) {
                try {
                    mediaService.deleteProfileMedia(oldAvatarUrl);
                } catch (Exception e) {
                    log.error("Failed to delete old avatar image: {}", oldAvatarUrl, e);
                }
            }
        }

        profile = profileRepository.save(profile);

        return profileMapper.toProfileResponse(profile);
    }

    public void changePassword(PasswordChangeRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        var profile = profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        try {
            identityClient.exchangeToken(TokenExchangeParam.builder()
                    .grant_type("password")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .username(profile.getUsername())
                    .password(request.getOldPassword())
                    .scope("openid")
                    .build());
        } catch (FeignException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        try {
            var tokenInfo = identityClient.exchangeToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());

            identityClient.resetPassword(
                    "Bearer " + tokenInfo.getAccessToken(),
                    userID,
                    Credential.builder()
                            .type("password")
                            .temporary(false)
                            .value(request.getNewPassword())
                            .build());
        } catch (FeignException e) {
            throw errorNormalizer.handleKeycloakException(e);
        }
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

    public AddressResponse addAddress(AddressRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var address = addressMapper.toAddress(request);
        address = addressRepository.save(address);

        if (profile.getAddresses() == null) {
            profile.setAddresses(new HashSet<>());
        }

        if (profile.getAddresses().isEmpty() || request.isDefaultAddress()) {
            handleDefaultAddress(profile, address);
        }

        profile.getAddresses().add(address);
        profileRepository.save(profile);

        return addressMapper.toAddressResponse(address);
    }

    public AddressResponse updateAddress(String addressId, AddressRequest request) {
        var address =
                addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found"));

        addressMapper.updateAddress(address, request);

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();
        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.isDefaultAddress()) {
            handleDefaultAddress(profile, address);
        }

        address = addressRepository.save(address);
        return addressMapper.toAddressResponse(address);
    }

    public void deleteAddress(String addressId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();
        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var address =
                addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found"));

        profile.getAddresses().remove(address);
        profileRepository.save(profile);
        addressRepository.delete(address);
    }

    public AddressResponse setDefaultAddress(String addressId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();
        var profile =
                profileRepository.findByUserId(userID).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var address =
                addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found"));

        handleDefaultAddress(profile, address);
        profileRepository.save(profile);

        return addressMapper.toAddressResponse(address);
    }

    private void handleDefaultAddress(Profile profile, Address defaultAddress) {
        if (profile.getAddresses() != null) {
            profile.getAddresses().forEach(addr -> addr.setDefaultAddress(false));
        }
        defaultAddress.setDefaultAddress(true);
    }

    private String extractUserId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").getFirst();
        String[] splitStr = location.split("/");
        return splitStr[splitStr.length - 1];
    }
}
