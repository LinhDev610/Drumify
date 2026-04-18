package com.linhdev.drumify.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.linhdev.drumify.dto.response.BannerResponse;
import com.linhdev.drumify.entity.Banner;

@Mapper(componentModel = "spring")
public interface BannerMapper {
    BannerResponse toBannerResponse(Banner banner);

    List<BannerResponse> toBannerResponses(List<Banner> banners);
}
