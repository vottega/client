import axios from "axios";

// axios 인스턴스 생성
export const apiClient = axios.create({
  // 개발 환경에서는 Vite proxy를 사용하고, 프로덕션에서는 실제 서버 URL 사용
  baseURL: import.meta.env.DEV ? "" : (import.meta.env.VITE_SERVER_HOST ?? ""),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

// 타입 정의
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export default apiClient;
