import axios from "axios";
import { CONFIG } from "./configuration";

const httpClient = axios.create({
    baseURL: CONFIG.API_GATEWAY,
    timeout: 30000,
    headers: {
        "Content-Type": "Application/json",
    },
});

export default httpClient;