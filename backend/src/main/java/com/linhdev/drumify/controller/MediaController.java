package com.linhdev.drumify.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.service.MediaService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaController {

    MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<List<String>> uploadProfileMedia(@RequestPart("files") List<MultipartFile> files) {
        List<String> urls =
                files.parallelStream().map(mediaService::storeProfileMedia).collect(Collectors.toList());
        return ApiResponse.<List<String>>builder().result(urls).build();
    }
}
