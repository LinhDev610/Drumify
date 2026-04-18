import axios from "axios";
import { CONFIG } from "./configuration";
import keycloak from "../keycloak";

const httpClient = axios.create({
    baseURL: CONFIG.API_GATEWAY,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

httpClient.interceptors.request.use(
    async (config) => {
        if (keycloak.authenticated) {
            try {
                await keycloak.updateToken(5);
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            } catch (error) {
                console.error("Failed to refresh token:", error);
                keycloak.login();
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;