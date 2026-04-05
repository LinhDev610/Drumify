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