import axios from "axios";

const baseURL = "http://localhost:4000";
const withCredentials = true

const API = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials
});

const AUTH = axios.create({
    baseURL: `${baseURL}/api/auth`,
    withCredentials
})

const FRIEND_API = axios.create({
    baseURL: `${baseURL}/api/friends`,
    withCredentials
})

const USER_API = axios.create({
    baseURL: `${baseURL}/api/users`,
    withCredentials
});

const MESSAGE_API = axios.create({
    baseURL: `${baseURL}/api/conversations`,
    withCredentials
})

export { API, AUTH, FRIEND_API, MESSAGE_API, USER_API, axios }