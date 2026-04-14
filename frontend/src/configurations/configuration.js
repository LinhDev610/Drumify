export const CONFIG = {
    API_GATEWAY: "http://localhost:8080/drumify"
}

export const API = {
    REGISTRATION: "/register",
    MY_PROFILE: "/my-profile",
    PROFILES: "/profiles",
    ADDRESSES: "/my-profile/addresses",
    PROVINCES: "/location/provinces",
    DISTRICTS: "/location/districts",
    WARDS: "/location/wards",
    MEDIA_UPLOAD: "/media/upload",
    CHANGE_PASSWORD: "/my-profile/password",
    USER_ROLES: (userId) => `/profiles/${userId}/roles`,
    USER_GROUPS: (userId) => `/profiles/${userId}/groups`,
    CREATE_STAFF: "/profiles/staff",
    ROLES: "/roles",
    GROUPS: "/groups"
}

export const KEYCLOAK_CONFIG = {
    url: "http://localhost:8280",
    realm: "drumify-dev",
    clientId: "linhdev_drumify_app_FE"
}

export const CLOUDINARY_CONFIG = {
    UPLOAD_URL: "https://api.cloudinary.com/v1_1",
    CLOUD_NAME: "dmr0xjzld",
    API_KEY: "831846789163981",
    UPLOAD_PRESET: "drumify_unsigned_preset",
}

// Logic folder structure based on user requirements
export const CLOUDINARY_FOLDERS = {
    AVATARS: "drumify/users/avatars",
    PRODUCT_IMAGES: (productId) => `drumify/products/${productId}/images`,
    PRODUCT_VIDEOS: (productId) => `drumify/products/${productId}/videos`,
    PROMOTIONS: "drumify/marketing/promotions",
    VOUCHERS: "drumify/marketing/vouchers",
}