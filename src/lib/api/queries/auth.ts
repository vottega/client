import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import {
  AuthResponseDTO,
  ParticipantAuthResponseDTO,
  VerifyResponseDTO,
} from "../types/auth-service.dto";
import { queryKeys } from "./index";

// 인증 관련 API 함수들
export const authApi = {
  verifyToken: async (token: string): Promise<VerifyResponseDTO> => {
    const response = await apiClient.post(Endpoints.auth.verify().path, { token });
    return response.data;
  },

  authenticateUser: async (credentials: {
    userId: string;
    password: string;
  }): Promise<AuthResponseDTO> => {
    const response = await apiClient.post(Endpoints.auth.authenticateUser().path, credentials);
    return response.data;
  },

  authenticateParticipant: async (data: {
    participantId: string;
  }): Promise<ParticipantAuthResponseDTO> => {
    const response = await apiClient.post(Endpoints.auth.authenticateParticipant().path, data);
    return response.data;
  },
};

// 커스텀 훅들
export const useVerifyToken = (token: string) => {
  return useQuery({
    queryKey: queryKeys.auth.verify(),
    queryFn: () => authApi.verifyToken(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

export const useAuthenticateUser = () => {
  return useMutation({
    mutationFn: authApi.authenticateUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
};

export const useAuthenticateParticipant = () => {
  return useMutation({
    mutationFn: authApi.authenticateParticipant,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.verify(), null);
      queryClient.clear();
    },
  });
};
