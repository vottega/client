import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import {
  CreateRoomRequestDTO,
  RoomResponseDTO,
  UpdateRoomRequestDTO,
  type ParticipantInfoDTO,
} from "../types/room-service.dto";
import { queryKeys } from "./index";

// 방 관련 API 함수들
export const roomApi = {
  getRooms: async ({ userId }: { userId: number }): Promise<{ roomList: RoomResponseDTO[] }> => {
    const response = await apiClient.get(Endpoints.room.listByUser().path, {
      params: { userId },
    });
    return response.data;
  },

  getRoom: async ({ roomId }: { roomId: string }): Promise<RoomResponseDTO> => {
    const response = await apiClient.get(Endpoints.room.get(roomId).path);
    return response.data;
  },

  createRoom: async (data: CreateRoomRequestDTO): Promise<RoomResponseDTO> => {
    const response = await apiClient.post(Endpoints.room.create().path, data);
    return response.data;
  },

  updateRoom: async ({
    roomId,
    data,
  }: {
    roomId: string;
    data: UpdateRoomRequestDTO;
  }): Promise<RoomResponseDTO> => {
    const response = await apiClient.patch(Endpoints.room.update(roomId).path, data);
    return response.data;
  },

  addRole: async ({ roomId, role }: { roomId: string; role: string }): Promise<void> => {
    const response = await apiClient.put(Endpoints.room.addRole(roomId).path, { role });
    return response.data;
  },

  deleteRole: async ({ roomId, role }: { roomId: string; role: string }): Promise<void> => {
    const response = await apiClient.delete(Endpoints.room.deleteRole(roomId, role).path);
    return response.data;
  },

  addParticipant: async ({
    roomId,
    data,
  }: {
    roomId: string;
    data: ParticipantInfoDTO[];
  }): Promise<RoomResponseDTO> => {
    const response = await apiClient.put(Endpoints.participant.add(roomId).path, data);
    return response.data;
  },

  deleteParticipant: async ({
    roomId,
    participantId,
  }: {
    roomId: string;
    participantId: string;
  }): Promise<ParticipantInfoDTO> => {
    const response = await apiClient.delete(
      Endpoints.participant.delete(roomId, participantId).path,
    );
    return response.data;
  },

  updateParticipant: async ({
    roomId,
    participantId,
    data,
  }: {
    roomId: string;
    participantId: string;
    data: ParticipantInfoDTO;
  }): Promise<ParticipantInfoDTO> => {
    const response = await apiClient.patch(
      Endpoints.participant.update(roomId, participantId).path,
      data,
    );
    return response.data;
  },

  getRoomByParticipant: async ({
    participantId,
  }: {
    participantId: string;
  }): Promise<RoomResponseDTO> => {
    const response = await apiClient.get(
      Endpoints.participant.getRoomByParticipant(participantId).path,
    );
    return response.data;
  },
};

// 커스텀 훅들
export const useRooms = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.rooms.byUser(),
    queryFn: () => roomApi.getRooms({ userId }),
  });
};

export const useRoom = (roomId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.rooms.detail(roomId ?? ""),
    queryFn: () => roomApi.getRoom({ roomId: roomId! }),
    enabled: !!roomId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byUser() });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.updateRoom,
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byUser() });
    },
  });
};

export const useAddRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.addRole,
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.deleteRole,
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
};

/**
 * Hook for adding a participant to a room
 */
export const useAddParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.addParticipant,
    onSuccess: (_, { roomId }) => {
      console.log("addParticipant onSuccess", roomId);
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
};

/**
 * Hook for deleting a participant from a room
 */
export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomApi.deleteParticipant,
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
}

/**
 * Hook for updating a participant in a room
 */
export function useUpdateParticipant() {
  return useMutation({
    mutationFn: roomApi.updateParticipant,
  });
}

/**
 * Hook for getting room information by participant ID
 */
export function useGetRoomByParticipant(participantId: string) {
  return useQuery({
    queryKey: ["room", "participant", participantId],
    queryFn: async (): Promise<RoomResponseDTO> => {
      return roomApi.getRoomByParticipant({ participantId });
    },
    enabled: !!participantId,
  });
}
