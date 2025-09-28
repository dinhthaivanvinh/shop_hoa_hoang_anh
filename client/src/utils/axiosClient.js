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
    console.error('❌ API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;
