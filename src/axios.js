// axios.js
import axios from "axios";
import store from './redux';
import { refreshTokenApi } from './services/authService';
import * as actions from './store/actions';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true
});

// gắn access token vào request
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// tự refresh khi token hết hạn
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const shouldRefresh = (status === 401 || status === 403) && !originalRequest._retry;

    if (!shouldRefresh) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refreshTokenApi();
      const newToken = data.accessToken;

      store.dispatch(actions.updateAccessToken(newToken));
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return instance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      store.dispatch(actions.processLogout());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
