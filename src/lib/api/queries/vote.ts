import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { queryKeys } from "./index";
import {
  VoteResponseDTO,
  VoteDetailResponseDTO,
  VoteRequestDTO,
  VotePaperRequestDTO,
  VoteStatusRequestDTO,
} from "../types/vote-service.dto";

// 투표 관련 API 함수들
export const voteApi = {
  getVoteInfo: async (roomId: string | number): Promise<VoteResponseDTO[]> => {
    const response = await apiClient.get(Endpoints.vote.getInfo(roomId).path);
    return response.data;
  },

  getVoteDetail: async (voteId: string | number): Promise<VoteDetailResponseDTO> => {
    const response = await apiClient.get(Endpoints.vote.getDetail(voteId).path);
    return response.data;
  },

  createVote: async (
    roomId: string | number,
    data: VoteRequestDTO,
  ): Promise<VoteDetailResponseDTO> => {
    const response = await apiClient.post(Endpoints.vote.create(roomId).path, data);
    return response.data;
  },

  submitVote: async (voteId: string | number, data: VotePaperRequestDTO): Promise<void> => {
    await apiClient.put(Endpoints.vote.submit(voteId).path, data);
  },

  updateVoteStatus: async (voteId: string | number, data: VoteStatusRequestDTO): Promise<void> => {
    await apiClient.post(Endpoints.vote.updateStatus(voteId).path, data);
  },

  resetVote: async (voteId: string | number): Promise<void> => {
    await apiClient.post(Endpoints.vote.reset(voteId).path);
  },
};

// 커스텀 훅들
export const useVoteInfo = (roomId: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.votes.byRoom(roomId!),
    queryFn: () => voteApi.getVoteInfo(roomId!),
    enabled: !!roomId,
  });
};

export const useVoteDetail = (voteId: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.votes.detail(voteId!),
    queryFn: () => voteApi.getVoteDetail(voteId!),
    enabled: !!voteId,
  });
};

export const useCreateVote = (roomId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoteRequestDTO) => voteApi.createVote(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.byRoom(roomId) });
    },
  });
};

export const useSubmitVote = (voteId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VotePaperRequestDTO) => voteApi.submitVote(voteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(voteId) });
    },
  });
};

export const useUpdateVoteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      voteId,
      data,
    }: {
      voteId: string | number;
      data: VoteStatusRequestDTO;
      roomId: string | number;
    }) => voteApi.updateVoteStatus(voteId, data),
    onSuccess: (_, { voteId, roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(voteId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.byRoom(roomId) });
    },
  });
};

export const useResetVote = (voteId: string | number, roomId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => voteApi.resetVote(voteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.detail(voteId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.votes.byRoom(roomId) });
    },
  });
};
