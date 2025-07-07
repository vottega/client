import { RoleList } from "@/components/RoleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Roles, ROLES } from "@/constants/role";
import { Endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { ParticipantInfoDTO, RoomResponseDTO } from "@/lib/api/types/room-service.dto";
import { useCreateRoom } from "@/lib/api/queries/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export default function NewRoomPage() {
  const navigate = useNavigate();
  const FormSchema = z.object({
    roomName: z.string().min(1, { message: "회의실 이름을 입력해주세요." }),
    participantRoleList: z.array(
      z.object({
        role: z.string(),
        canVote: z.boolean(),
      }),
    ),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomName: "",
      participantRoleList: [],
    },
  });
  const [roles, setRoles] = useState<Roles>(ROLES);

  const me: ParticipantInfoDTO = {
    name: "류기현",
    phoneNumber: "01011551144",
    position: "연 대 컴 과",
    role: "의장",
  };

  const registerMeApi = async (roomId: number): Promise<RoomResponseDTO> => {
    const response = await apiClient.put(Endpoints.participant.add(roomId).path, [me]);
    return response.data;
  };

  const { mutate: createRoom, data: roomData, error, isPending: isCreating } = useCreateRoom();

  const {
    mutate: registerMe,
    error: registerError,
    data: registerData,
    isPending: isRegistering,
  } = useMutation({
    mutationFn: registerMeApi,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData: typeof data = { ...data, participantRoleList: [...roles.values()] };
    const createRoomRequestBody = { ...newData, ownerId: 1 };
    createRoom(createRoomRequestBody);
  }

  useEffect(() => {
    if (roomData && !registerData && !registerError) {
      registerMe(roomData.id);
    }
  }, [roomData, registerData, registerError, registerMe]);

  useEffect(() => {
    if (error) {
      // TODO: Error UI
      return;
    }
  }, [error]);

  useEffect(() => {
    if (registerError) {
      // TODO: Error UI
      return;
    }

    if (registerData && roomData) {
      navigate(`/rooms/${roomData.id}`);
    }
  }, [registerError, navigate, registerData, roomData]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>회의실 만들기</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">회의실 이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="회의실 이름을 입력해주세요." autoFocus />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="sr-only">회의실 이름을 입력해주세요.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participantRoleList"
              render={() => (
                <FormItem>
                  <FormLabel className="text-right">참여자 역할</FormLabel>
                  <FormDescription>
                    스위치 버튼으로 참여자 역할의 투표권 여부를 조정할 수 있어요.
                  </FormDescription>
                  <FormControl>
                    <Card>
                      <CardContent className="p-4">
                        <RoleList roles={roles} setRoles={setRoles} />
                      </CardContent>
                    </Card>
                  </FormControl>
                  <FormDescription className="sr-only">회의실 이름을 입력해주세요.</FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isCreating || isRegistering}>
                {isCreating ? "회의실 생성 중..." : isRegistering ? "등록 중..." : "회의실 만들기"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
