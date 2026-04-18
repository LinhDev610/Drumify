package com.linhdev.drumify.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.linhdev.drumify.dto.response.BannerResponse;
import com.linhdev.drumify.mapper.BannerMapper;
import com.linhdev.drumify.repository.BannerRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BannerService {
    BannerRepository bannerRepository;
    BannerMapper bannerMapper;

    public List<BannerResponse> listBanners() {
        return bannerMapper.toBannerResponses(bannerRepository.findAll());
    }
}
