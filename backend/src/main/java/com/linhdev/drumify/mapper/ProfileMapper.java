package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;

import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.response.ProfileResponse;
import com.linhdev.drumify.entity.Profile;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(RegistrationRequest request);

    ProfileResponse toProfileResponse(Profile profile);
}
