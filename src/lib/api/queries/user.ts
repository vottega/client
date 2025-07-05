import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { queryKeys } from "./index";
import {
  UserCreateRequest,
  UserIdCheckRequest,
  EmailCheckRequest,
  EmailSendRequest,
  EmailValidateRequest,
} from "../types/user-service.dto";

// 사용자 관련 API 함수들
export const userApi = {
  createUser: async (data: UserCreateRequest): Promise<void> => {
    await apiClient.post(Endpoints.user.create().path, data);
  },

  checkUserId: async (data: UserIdCheckRequest): Promise<{ isDuplicate: boolean }> => {
    const response = await apiClient.post(Endpoints.user.checkUserId().path, data);
    return response.data;
  },

  checkEmail: async (data: EmailCheckRequest): Promise<{ isDuplicate: boolean }> => {
    const response = await apiClient.post(Endpoints.user.checkEmail().path, data);
    return response.data;
  },

  sendEmail: async (data: EmailSendRequest): Promise<void> => {
    await apiClient.post(Endpoints.user.sendEmail().path, data);
  },

  validateCode: async (data: EmailValidateRequest): Promise<{ valid: boolean }> => {
    const response = await apiClient.post(Endpoints.user.validateCode().path, data);
    return response.data;
  },
};

// 커스텀 훅들
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
    },
  });
};

export const useCheckUserId = () => {
  return useMutation({
    mutationFn: userApi.checkUserId,
  });
};

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: userApi.checkEmail,
  });
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: userApi.sendEmail,
  });
};

export const useValidateCode = () => {
  return useMutation({
    mutationFn: userApi.validateCode,
  });
};
