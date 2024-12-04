"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Header } from "@/components/ui/header";
import { Main } from "@/components/ui/main";

export default function Rooms() {
  const router = useRouter();
  const FormSchema = z.object({
    title: z.string({
      required_error: "회의실 이름을 입력해주세요.",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const roomId = 1;
    router.push(`/rooms/${roomId}/setting`);
  }

  return (
    <>
      <Header />
      <Main>
        <div className="flex items-center">
          <h2 className="text-lg font-semibold md:text-2xl">회의실</h2>
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">아직 만든 회의실이 없어요.</h3>
            <p className="text-sm text-muted-foreground">
              회의실을 만들면 투표를 시작할 수 있어요.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">회의실 만들기</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>회의실 만들기</DialogTitle>
                  <DialogDescription>
                    기본적인 정보를 입력해 회의실을 만들어주세요.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                          <FormLabel className="text-right">회의실 이름</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="회의실 이름을 입력해주세요."
                              className="col-span-3"
                            />
                          </FormControl>
                          <FormDescription className="sr-only">
                            회의실 이름을 입력해주세요.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">만들기</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Main>
    </>
  );
}
