package com.linhdev.drumify.dto.response;

import com.linhdev.drumify.enums.ContentType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerResponse {
    String id;
    String title;
    String description;
    String imageUrl;
    String linkUrl;
    ContentType contentType;
    Boolean status;
    Integer orderIndex;
}
