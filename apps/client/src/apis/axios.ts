import axios from "axios";

const baseURL = "http://localhost:4000"

const API = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true
});

const AUTH = axios.create({
    baseURL: `${baseURL}/api/auth`,
    withCredentials: true
})

const FRIEND_API = axios.create({
    baseURL: `${baseURL}/api/friends`,
    withCredentials: true
})

const USER_API = axios.create({
    baseURL: `${baseURL}/api/users`,
    withCredentials: true
})

export { API, AUTH, FRIEND_API, USER_API, axios }