package com.linhdev.drumify.dto.response;

import com.linhdev.drumify.enums.MediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMediaResponse {
    String id;
    String mediaUrl;
    MediaType mediaType;
    boolean isDefault;
}
