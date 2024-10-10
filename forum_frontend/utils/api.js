// utils/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Replace with your backend URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/signin';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post('http://localhost:8000/api/dj-rest-auth/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('authToken', newAccessToken);

                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/signin';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
