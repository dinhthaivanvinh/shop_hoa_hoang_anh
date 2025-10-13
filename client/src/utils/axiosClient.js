import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // nếu backend cần cookie/session
});

// Optional: interceptor để xử lý lỗi hoặc token
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url;
    const method = err.config?.method;
    const message = err.response?.data?.error || err.message;

    console.error(`❌ [${method?.toUpperCase()} ${url}] → ${status || 'NO STATUS'}: ${message}`);
    return Promise.reject(err);
  }
);


export default axiosClient;
