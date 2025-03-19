"use client";

import { APIErrorResponse } from "@/app/api/types";
import { CreateRoomRequest, CreateRoomResponse } from "@/app/api/types/room";
import { RoleList } from "@/app/rooms/RoleList";
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
import { TheHeader } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Roles, ROLES } from "@/constants/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

  const createRoom = async (url: string, { arg }: { arg: CreateRoomRequest }) => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(arg),
      headers,
    });

    const data: CreateRoomResponse | APIErrorResponse = await response.json();

    if (!response.ok) {
      // TODO: 에러처리 및 에러UI
      return null;
    }

    return data as CreateRoomResponse;
  };

  // TODO: 에러/로딩 처리, 미들웨어 작성
  const { trigger, data, error } = useSWRMutation<
    CreateRoomResponse | null,
    any,
    string,
    CreateRoomRequest,
    CreateRoomResponse
  >("http://localhost:8082/api/room", createRoom);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData: typeof data = { ...data, participantRoleList: [...roles.values()] };
    const createRoomRequestBody = { ...newData, ownerId: 1 };
    trigger(createRoomRequestBody);
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      router.push(`/rooms/${data.id}`);
    }
  }, [data, router]);

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
