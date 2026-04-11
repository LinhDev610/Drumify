import { API } from "../configurations/configuration"
import httpClient from "../configurations/httpCient"
import keycloak from "../keycloak"

export const register = async (data) => {
    return await httpClient.post(API.REGISTRATION, data);
}

export const getMyProfile = async () => {
    return await httpClient.get(API.MY_PROFILE, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    })
}

export const getProfiles = async () => {
    return await httpClient.get(API.PROFILES, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    })
}

export const updateMyProfile = async (data) => {
    return await httpClient.put(API.MY_PROFILE, data, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });
}

// Address Management
export const addAddress = async (data) => {
    return await httpClient.post(API.ADDRESSES, data, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });
}

export const updateAddress = async (addressId, data) => {
    return await httpClient.put(`${API.ADDRESSES}/${addressId}`, data, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });
}

export const deleteAddress = async (addressId) => {
    return await httpClient.delete(`${API.ADDRESSES}/${addressId}`, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });
}

export const setDefaultAddress = async (addressId) => {
    return await httpClient.patch(`${API.ADDRESSES}/${addressId}/default`, null, {
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });
}

// Location Data
export const getProvinces = async () => {
    return await httpClient.get(API.PROVINCES);
}

export const getDistricts = async (provinceId) => {
    return await httpClient.get(`${API.DISTRICTS}/${provinceId}`);
}

export const getWards = async (districtId) => {
    return await httpClient.get(`${API.WARDS}/${districtId}`);
}