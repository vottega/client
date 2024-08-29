"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function VoteForm() {
  const formSchema = z.object({
    agendaName: z.string(),
    voteContent: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agendaName: "",
      voteContent: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>안건 생성하기</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="agendaName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>안건명</FormLabel>
                  <FormControl>
                    <Input placeholder="안건명을 입력해주세요." {...field} />
                  </FormControl>
                  <FormDescription>
                    예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="voteContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>표결 내용</FormLabel>
                  <FormControl>
                    <Input placeholder="표결 내용을 입력해주세요." {...field} />
                  </FormControl>
                  <FormDescription>
                    예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">투표 시작하기</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function ConnectedParticipants() {
  return (
    <ul>
      <li></li>
    </ul>
  );
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <VoteForm />
      <ConnectedParticipants />
    </div>
  );
}
