import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { queryKeys } from "./index";
import {
  ParticipantAuthResponseDTO,
  AuthResponseDTO,
  VerifyResponseDTO,
} from "../types/auth-service.dto";

// 인증 관련 API 함수들
export const authApi = {
  verifyToken: async (): Promise<VerifyResponseDTO> => {
    const response = await apiClient.post(Endpoints.auth.verify().path);
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
export const useVerifyToken = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: queryKeys.auth.verify(),
    queryFn: authApi.verifyToken,
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

export const useAuthenticateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.authenticateUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(queryKeys.auth.verify(), data);
    },
  });
};

export const useAuthenticateParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.authenticateParticipant,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(queryKeys.auth.verify(), data);
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
      queryClient.clear();
    },
  });
};
