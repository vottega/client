"use client";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ROLES, Roles } from "@/constants/role";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const FormSchema = z.object({
    roomName: z.string().min(1, { message: "회의실 이름을 입력해주세요." }),
    participantRoleList: z.array(
      z.object({
        value: z.string(),
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const roomId = 1;
    router.push(`/rooms/${roomId}`);
  }

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
                      <Input {...field} placeholder="회의실 이름을 입력해주세요." />
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
                    <FormLabel className="text-right">참가자 역할</FormLabel>
                    <FormDescription>
                      스위치 버튼으로 참가자 역할의 투표권 여부를 조정할 수 있어요.
                    </FormDescription>
                    <FormControl>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            {[...roles.keys()].map((role, idx) => (
                              <RoleBadgeWithCanVoteSwitch
                                key={idx}
                                variant={idx}
                                setRoles={setRoles}
                              >
                                {role}
                              </RoleBadgeWithCanVoteSwitch>
                            ))}
                            <AddRoleBadge setRoles={setRoles} />
                          </div>
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

const pastelColors = [
  "bg-green-50", // 부드러운 그린
  "bg-blue-50", // 차분한 블루
  "bg-purple-50", // 파스텔 퍼플
  "bg-yellow-50", // 따뜻한 옐로우
  "bg-red-50", // 부드러운 레드
  "bg-pink-50", // 사랑스러운 핑크
  "bg-teal-50", // 청록색
  "bg-indigo-50", // 은은한 인디고
];

const BaseBadge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const badgeStyle = cn(
      "inline-flex items-center rounded-sm border px-2.5 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2",
      className,
    );
    return (
      <div className={badgeStyle} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
BaseBadge.displayName = "BaseBadge";

export function RoleBadge({
  className,
  children,
  variant,
}: HTMLAttributes<HTMLDivElement> & { variant: number }) {
  const bgColor = pastelColors[variant % pastelColors.length];
  return (
    <BaseBadge className={cn(`${bgColor} border-transparent`, className)}>{children}</BaseBadge>
  );
}

const RoleBadgeWithCanVoteSwitch = ({
  children,
  variant,
  setRoles,
}: HTMLAttributes<HTMLDivElement> & {
  variant: number;
  children: string;
  setRoles: Dispatch<SetStateAction<Roles>>;
}) => {
  const isDefaultRole = ROLES.has(children);
  const handleDeleteButton = () => {
    setRoles((prev) => {
      const nextRoles = new Map(prev);
      nextRoles.delete(children);
      return nextRoles;
    });
  };
  const handleCheckedChange = (checked: boolean) => {
    setRoles((prev) => {
      const nextRoles = new Map(prev);
      const target = nextRoles.get(children);
      const canVote = checked === true;
      if (target) {
        target.canVote = canVote;
      }
      return nextRoles;
    });
  };

  return (
    <RoleBadge className="h-[54px] px-4 rounded-lg relative justify-between" variant={variant}>
      <div className="flex items-center gap-2">
        {isDefaultRole ? (
          <Shield size={16} color="hsl(var(--primary))" />
        ) : (
          <Button
            type="button"
            onClick={handleDeleteButton}
            variant="ghost"
            size="icon-sm"
            className="w-fit h-fit"
          >
            <X size={16} color="hsl(var(--muted-foreground))" />
          </Button>
        )}
        <span className="font-medium break-all text-overflow">{children}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Label htmlFor={`${children}-can-vote`} className="text-muted-foreground">
          투표권
        </Label>
        <Switch
          id={`${children}-can-vote`}
          defaultChecked={true}
          className="data-[state=checked]:bg-zinc-700"
          onCheckedChange={handleCheckedChange}
        />
      </div>
    </RoleBadge>
  );
};

const AddRoleBadge = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { setRoles: Dispatch<SetStateAction<Roles>> }
>(({ setRoles, ...props }, ref) => {
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState("");
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && newRole !== "") {
      setShowInput(false);
      setRoles((prev) => {
        const nextRoles = new Map(prev);
        if (nextRoles.has(newRole)) return nextRoles;
        nextRoles.set(newRole, { value: newRole, canVote: true });
        return nextRoles;
      });
      setNewRole("");
    }

    if (e.key === "Escape") {
      setShowInput(false);
    }
  };

  return (
    <BaseBadge
      className="hover:bg-accent hover:text-accent-foreground h-[54px] px-4 rounded-lg cursor-pointer border-dashed"
      ref={ref}
      {...props}
      onClick={() => setShowInput(true)}
    >
      <Plus size={16} />
      {showInput ? (
        <Input
          className="w-[200px] h-[30px]"
          placeholder="예: 부의장, 보조 서기, 타임키퍼"
          onChange={(e) => setNewRole(e.target.value)}
          value={newRole}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        "역할 추가"
      )}
    </BaseBadge>
  );
});
AddRoleBadge.displayName = "AddRoleBadge";
