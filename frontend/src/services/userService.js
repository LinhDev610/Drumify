import { API } from "../configurations/configuration"
import httpClient from "../configurations/httpCient"

export const register = async (data) => {
    return await httpClient.post(API.REGISTRATION, data);
}

export const getMyProfile = async () => {
    return await httpClient.get(API.MY_PROFILE);
}

export const getProfiles = async () => {
    return await httpClient.get(API.PROFILES);
}

export const getUsers = async () => {
    return await httpClient.get(API.PROFILES);
}

export const assignRoles = async (userId, roles) => {
    return await httpClient.post(API.USER_ROLES(userId), roles);
}

export const assignGroups = async (userId, groups) => {
    return await httpClient.post(API.USER_GROUPS(userId), groups);
}

export const getRoles = async () => {
    return await httpClient.get(API.ROLES);
}

export const getGroups = async () => {
    return await httpClient.get(API.GROUPS);
}

export const createStaff = async (data) => {
    return await httpClient.post(API.CREATE_STAFF, data);
}

export const updateMyProfile = async (data) => {
    return await httpClient.put(API.MY_PROFILE, data);
}

export const changePassword = async (data) => {
    return await httpClient.put(API.CHANGE_PASSWORD, data);
}

// Address Management
export const addAddress = async (data) => {
    return await httpClient.post(API.ADDRESSES, data);
}

export const updateAddress = async (addressId, data) => {
    return await httpClient.put(`${API.ADDRESSES}/${addressId}`, data);
}

export const deleteAddress = async (addressId) => {
    return await httpClient.delete(`${API.ADDRESSES}/${addressId}`);
}

export const setDefaultAddress = async (addressId) => {
    return await httpClient.patch(`${API.ADDRESSES}/${addressId}/default`, null);
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