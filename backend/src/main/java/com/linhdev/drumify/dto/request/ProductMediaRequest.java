package com.linhdev.drumify.dto.request;

import com.linhdev.drumify.enums.MediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMediaRequest {
    String mediaUrl;
    MediaType mediaType;
    boolean isDefault;
}
