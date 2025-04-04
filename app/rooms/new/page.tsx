"use client";

import { RoleList } from "@/app/rooms/RoleList";
import TheHeader from "@/components/TheHeader";
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
import { customFetch } from "@/lib/api/fetcher";
import {
  CreateRoomRequestDTO,
  ParticipantInfoDTO,
  RoomResponseDTO,
} from "@/lib/api/types/room-service.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
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

  const createRoomFetcher = async (url: string, { arg }: { arg: CreateRoomRequestDTO }) =>
    customFetch<RoomResponseDTO>(url, {
      method: "POST",
      body: JSON.stringify(arg),
    });

  const registerMeFetcher = async (url: string) =>
    customFetch<RoomResponseDTO>(url, {
      method: "PUT",
      body: JSON.stringify([me]),
    });

  // TODO: 에러/로딩 처리, 미들웨어 작성
  const {
    trigger: createRoom,
    data: roomData,
    error,
  } = useSWRMutation<RoomResponseDTO, Error, string, CreateRoomRequestDTO, RoomResponseDTO>(
    Endpoints.room.create().toFullPath(),
    createRoomFetcher,
  );

  const { error: registerError, data: registerData } = useSWR<
    RoomResponseDTO,
    Error,
    () => string | null
  >(
    () => (roomData?.id ? Endpoints.participant.add(roomData.id).toFullPath() : null),
    registerMeFetcher,
  );

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData: typeof data = { ...data, participantRoleList: [...roles.values()] };
    const createRoomRequestBody = { ...newData, ownerId: 1 };
    createRoom(createRoomRequestBody);
  }

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
      router.push(`/rooms/${roomData.id}`);
    }
  }, [registerError, router, registerData, roomData]);

  return (
    <>
      <TheHeader />
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
                    <FormDescription className="sr-only">
                      회의실 이름을 입력해주세요.
                    </FormDescription>
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
                    <FormDescription className="sr-only">
                      회의실 이름을 입력해주세요.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">회의실 만들기</Button>
              </DialogFooter>
            </form>
          </Form>
        </CardContent>
      </div>
    </>
  );
}
