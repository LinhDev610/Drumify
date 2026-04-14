package com.linhdev.drumify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.linhdev.drumify.dto.request.ProfileUpdateRequest;
import com.linhdev.drumify.dto.request.RegistrationRequest;
import com.linhdev.drumify.dto.request.StaffCreationRequest;
import com.linhdev.drumify.dto.response.ProfileResponse;
import com.linhdev.drumify.entity.Profile;

@Mapper(
        componentModel = "spring",
        uses = {AddressMapper.class})
public interface ProfileMapper {
    Profile toProfile(RegistrationRequest request);

    Profile toProfile(StaffCreationRequest request);

    ProfileResponse toProfileResponse(Profile profile);

    void updateProfile(@MappingTarget Profile profile, ProfileUpdateRequest request);
}
