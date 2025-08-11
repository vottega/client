import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddParticipant, useRoom } from "@/lib/api/queries/room";
import { cn, phoneRegex } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type Invitation = z.infer<typeof InvitationSchema>;
const InvitationSchema = z.object({
  name: z
    .string({
      required_error: "이름을 입력해주세요.",
    })
    .min(1, { message: "이름은 최소 1자 이상이어야 합니다." }),
  phoneNumber: z
    .string()
    .regex(phoneRegex, {
      message: "유효하지 않은 전화번호 형식 (예시: 01012345678)",
    })
    .nullable(),
  position: z.string().nullable(),
});

export function InvitationForm({ roomId, className }: { roomId: string; className?: string }) {
  const { mutate: addParticipant, isSuccess: isAddParticipantSuccess } = useAddParticipant();
  const { data: room } = useRoom(roomId);
  const participants = room?.participants ?? [];
  const form = useForm<z.infer<typeof InvitationSchema>>({
    resolver: zodResolver(InvitationSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      position: "",
    },
  });

  const [notification, setNotification] = useState<"idle" | "success" | "fail">("idle");
  const [animate, setAnimate] = useState<boolean>(true);
  const [newParticipantName, setNewParticipantName] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  function onSubmit(data: Invitation) {
    if (participants.find(({ name }) => name === data.name)) {
      setNotification("fail");
    } else {
      addParticipant({
        roomId,
        data: [
          {
            name: data.name,
            phoneNumber: data.phoneNumber || null,
            position: data.position || null,
            role: "회의자",
          },
        ],
      });
      setNewParticipantName(data.name);
    }

    setAnimate(true);
  }

  useEffect(() => {
    if (isAddParticipantSuccess) {
      setNotification("success");
      firstInputRef.current?.focus();
      form.reset();
    }
  }, [isAddParticipantSuccess]);

  return (
    <div className={cn("grid gap-4", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 items-center gap-2 space-y-0">
                <FormLabel>
                  성함 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl className="col-span-2">
                  <Input
                    {...field}
                    placeholder="성함을 입력해주세요."
                    autoFocus
                    ref={firstInputRef}
                  />
                </FormControl>
                <FormMessage className="col-span-2 col-start-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 items-center gap-2 space-y-0">
                <FormLabel>전화번호</FormLabel>
                <FormControl className="col-span-2">
                  <Input
                    type="tel"
                    {...field}
                    value={field.value ?? ""}
                    placeholder="전화번호를 입력해주세요."
                    className="m-0"
                  />
                </FormControl>
                <FormMessage className="col-span-2 col-start-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="grid grid-cols-3 items-center gap-2 space-y-0">
                <FormLabel>소속</FormLabel>
                <FormControl className="col-span-2">
                  <Input {...field} value={field.value ?? ""} placeholder="소속을 입력해주세요." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center">
            <Button type="submit" className="w-full">
              추가하기
            </Button>
          </div>
        </form>
      </Form>

      <p
        className={`text-sm font-medium ${notification === "fail" ? "text-destructive" : "text-muted-foreground"} transition-opacity inline-flex gap-2 items-center ${animate && notification === "fail" && "animate-bounce-horizontal"}`}
        onAnimationEnd={() => setAnimate(false)}
      >
        {notification === "idle" && "* 전화번호가 없으면 추후 다른 방법으로 초대할 수 있어요."}
        {notification === "fail" && "이미 등록된 전화번호예요. 전화번호를 확인해주세요."}
        {notification === "success" && (
          <>
            {newParticipantName}님을 참여자로 추가했어요.
            <CircleCheck
              color="hsl(var(--green))"
              strokeDasharray={200}
              className={`[stroke-dashoffset:250] fill-mode-forwards animate-draw ${animate && notification === "success" && "animate-draw"}`}
            />
          </>
        )}
        {notification === "fail" && (
          <CircleX color="hsl(var(--destructive))" className={`fill-mode-forwards`} />
        )}
      </p>
    </div>
  );
}
