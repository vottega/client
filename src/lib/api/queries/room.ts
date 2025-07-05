import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { queryKeys } from "./index";
import {
  RoomResponseDTO,
  CreateRoomRequestDTO,
  UpdateRoomRequestDTO,
} from "../types/room-service.dto";

// 룸 관련 API 함수들
export const roomApi = {
  getRooms: async (): Promise<RoomResponseDTO[]> => {
    const response = await apiClient.get(Endpoints.room.listByUser().path);
    return response.data;
  },

  getRoom: async (roomId: string | number): Promise<RoomResponseDTO> => {
    const response = await apiClient.get(Endpoints.room.get(roomId).path);
    return response.data;
  },

  createRoom: async (data: CreateRoomRequestDTO): Promise<RoomResponseDTO> => {
    const response = await apiClient.post(Endpoints.room.create().path, data);
    return response.data;
  },

  updateRoom: async (
    roomId: string | number,
    data: UpdateRoomRequestDTO,
  ): Promise<RoomResponseDTO> => {
    const response = await apiClient.patch(Endpoints.room.update(roomId).path, data);
    return response.data;
  },

  addRole: async (roomId: string | number, role: string): Promise<void> => {
    await apiClient.put(Endpoints.room.addRole(roomId).path, { role });
  },

  deleteRole: async (roomId: string | number, role: string): Promise<void> => {
    await apiClient.delete(Endpoints.room.deleteRole(roomId, role).path);
  },
};

// 커스텀 훅들
export const useRooms = () => {
  return useQuery({
    queryKey: queryKeys.rooms.byUser(),
    queryFn: roomApi.getRooms,
  });
};

export const useRoom = (roomId: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.rooms.detail(roomId!),
    queryFn: () => roomApi.getRoom(roomId!),
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

export const useUpdateRoom = (roomId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoomRequestDTO) => roomApi.updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byUser() });
    },
  });
};

export const useAddRole = (roomId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: string) => roomApi.addRole(roomId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
};

export const useDeleteRole = (roomId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: string) => roomApi.deleteRole(roomId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(roomId) });
    },
  });
};
