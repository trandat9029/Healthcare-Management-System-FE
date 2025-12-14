import axios from "../axios";

const handleLoginApi = (email, password) => {
    return axios.post("/api/auth/login", { email, password });
};

const refreshTokenApi = () => {
  return axios.post("/api/auth/refresh-token");
};

const logoutApi = () => {
  return axios.post("/api/auth/logout");
};


export { 
    handleLoginApi,
    refreshTokenApi,
    logoutApi
}