import axios from "axios";
import { HttpError } from "./errors";

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
    // axios 에러를 HttpError로 변환
    if (error.response) {
      // 서버에서 응답은 왔지만 2xx 범위가 아닌 경우
      const httpError = new HttpError(
        error.response.status,
        error.response.statusText,
        error.response.data ? JSON.stringify(error.response.data) : error.message,
      );

      return Promise.reject(httpError);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      const networkError = new HttpError(0, "Network Error", error.message);
      return Promise.reject(networkError);
    } else {
      // 요청을 설정하는 중에 오류가 발생한 경우
      const configError = new HttpError(0, "Request Configuration Error", error.message);
      return Promise.reject(configError);
    }
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
