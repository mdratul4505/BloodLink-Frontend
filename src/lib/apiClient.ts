import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLI_API_BASE_URL

 export const apiClient = ofetch.create({
    baseURL : BASE_URL
})