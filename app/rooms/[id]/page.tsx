"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhone, phoneRegex } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Award, CircleCheck, CircleX, Trash2 } from "lucide-react";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "이름을 입력해주세요.",
    })
    .min(2, { message: "이름은 최소 2자 이상이어야 합니다." }),
  phone: z
    .string({
      required_error: "번호를 입력해주세요.",
    })
    .regex(phoneRegex, { message: "유효하지 않은 전화번호 형식입니다. (예시: 01012345678)" }),
});

type Invitation = z.infer<typeof FormSchema>;

type Participant = Invitation & {
  affiliation?: string;
  role?: string;
};

export function InvitationForm({
  invitations,
  setInvitations,
}: {
  invitations: Invitation[];
  setInvitations: any;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const [notification, setNotification] = useState<"idle" | "success" | "fail">("idle");
  const [animate, setAnimate] = useState<boolean>(true);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (invitations.find(({ phone }) => phone === data.phone)) {
      setNotification("fail");
    } else {
      setInvitations((prev: Invitation[]) => [...prev, data]);
      setNotification("success");
    }

    setAnimate(true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>성함</FormLabel>
              <FormControl>
                <Input {...field} placeholder="성함을 입력해주세요." />
              </FormControl>
              <FormDescription className="sr-only">성함을 입력해주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <Input type="tel" {...field} placeholder="전화번호를 입력해주세요." />
              </FormControl>
              <FormDescription>
                전화번호가 없으면 추후 다른 방법으로 초대할 수 있어요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center">
          <Button type="submit">추가하기</Button>
          {notification === "success" && (
            <CircleCheck
              color="green"
              strokeDasharray={200}
              className="[stroke-dashoffset:250] fill-mode-forwards animate-draw"
            />
          )}
          {notification === "fail" && (
            <CircleX
              color="hsl(var(--destructive))"
              className={`fill-mode-forwards ${animate && "animate-bounce-horizontal"}`}
              onAnimationEnd={() => setAnimate(false)}
            />
          )}
        </div>

        <p
          className={`text-sm font-medium text-destructive transition-opacity ${notification === "fail" ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          이미 등록된 전화번호예요. 전화번호를 확인해주세요.
        </p>
      </form>
    </Form>
  );
}

export function InvitationTable({
  invitations,
  setInvitations,
}: {
  invitations: Invitation[];
  setInvitations: any;
}) {
  const [me, ...others] = useMemo(() => invitations, [invitations]);
  const prevInvitationsLength = useRef<number>(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const selectedCount = useMemo(() => selected.size, [selected]);
  const skeletonFill = useMemo(() => Math.max(3 - others.length, 0), [others]);
  const tBody = useRef<HTMLTableSectionElement>(null);
  const checkboxSelectAll = useRef<HTMLButtonElement>(null);
  const checkboxes = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    if (invitations.length > prevInvitationsLength.current) {
      tBody.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
    prevInvitationsLength.current = invitations.length;
  }, [invitations]);

  const onClickDeleteButton = (e: MouseEvent<HTMLButtonElement>) => {
    setInvitations((invitations: Invitation[]) =>
      invitations.filter((_, idx) => !selected.has(idx)),
    );
    setSelected(new Set());
    checkboxSelectAll.current?.ariaChecked === "true" && checkboxSelectAll.current?.click();
  };
  const onCheckedChange = (checked: CheckedState, idx: number) => {
    if (checked) {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.add(idx);
        return newSet;
      });
    } else {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idx);
        return newSet;
      });
    }
  };
  const toggleSelectAll = (checked: CheckedState) => {
    if (checked) {
      setSelected(new Set(Array.from(others.keys()).map((key) => key + 1)));
      checkboxes.current.forEach((checkbox) => checkbox.ariaChecked !== "true" && checkbox.click());
    } else {
      setSelected(new Set());
      checkboxes.current.forEach((checkbox) => checkbox.ariaChecked === "true" && checkbox.click());
    }
  };

  return (
    <>
      <div className="flex justify-between items-center pl-4 border-b">
        <span className="text-sm">{selectedCount} 개 선택됨</span>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-destructive hover:text-destructive"
          onClick={onClickDeleteButton}
        >
          삭제하기
          <Trash2 size={16} color="hsl(var(--destructive))" />
        </Button>
      </div>

      <Table>
        <TableCaption className="sticky bottom-0 bg-white mt-0 pt-4 z-10">
          현재까지 초대된 목록이에요.
        </TableCaption>

        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>
              <Checkbox
                className="align-text-bottom"
                aria-label="전체 행 선택"
                onCheckedChange={toggleSelectAll}
                ref={checkboxSelectAll}
              />
            </TableHead>
            <TableHead>성함</TableHead>
            <TableHead className="text-right">전화번호</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody ref={tBody}>
          <TableRow className="h-[60px] relative">
            <TableCell></TableCell>
            <TableCell className="font-medium">
              {me.name}
              <Badge className="align-bottom">
                <Award size={14} />
              </Badge>
            </TableCell>
            <TableCell className="text-right">{formatPhone(me.phone)}</TableCell>
          </TableRow>

          {others.map((invitation, idx) => (
            <TableRow key={invitation.phone} className="relative h-[60px] z-0">
              <TableCell>
                <Checkbox
                  className="align-text-bottom"
                  aria-label="행 선택"
                  onCheckedChange={(checked) => {
                    onCheckedChange(checked, idx + 1);
                  }}
                  id={invitation.phone}
                  ref={(checkbox) => {
                    if (checkbox) {
                      checkboxes.current[idx] = checkbox;
                    }
                  }}
                />
                <Label
                  htmlFor={invitation.phone}
                  className="block w-full h-[60px] absolute bottom-0 left-0 cursor-pointer"
                ></Label>
              </TableCell>
              <TableCell className="font-medium">
                <span className="animate-fadein">{invitation.name}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="animate-fadein">{formatPhone(invitation.phone)}</span>
              </TableCell>
            </TableRow>
          ))}

          {[...Array(skeletonFill)].map((_, idx) => (
            <TableRow key={invitations.length + idx + 1} className="relative h-[60px] z-0">
              <TableCell></TableCell>
              <TableCell>
                <Skeleton className="h-6 w-10" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-6 w-28 ml-auto" />
              </TableCell>
            </TableRow>
          ))}

          <TableRow className="sr-only">
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="sticky bottom-[36px] bg-muted">
          <TableRow>
            <TableCell colSpan={2}>총 인원 수</TableCell>
            <TableCell className="text-right">{invitations.length}명</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default function RoomInit() {
  const steps = {
    invitePerson: 1,
    chooseRole: 2,
    authorizeRole: 3,
  } as const;
  const stepDescription = {
    [steps.invitePerson]:
      "QR코드를 전송할 사람을 입력해주세요.\n인원은 방을 개설한 후 언제든 새로 추가할 수 있어요.",
    [steps.chooseRole]:
      "QR코드를 전송할 사람을 입력해주세요.\n인원은 방을 개설한 후 언제든 새로 추가할 수 있어요.",
    [steps.authorizeRole]:
      "QR코드를 전송할 사람을 입력해주세요.\n인원은 방을 개설한 후 언제든 새로 추가할 수 있어요.",
  };
  type Step = (typeof steps)[keyof typeof steps];

  const [step, setStep] = useState<Step>(steps.invitePerson);
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      name: "류기현",
      phone: "01087654321",
    },
  ]);

  return (
    <div className="py-10 px-4 flex flex-col items-center h-screen gap-10">
      <header className="w-full flex flex-col items-center gap-2">
        <h1>방 이름</h1>
        <p className="text-center">{`${step} / ${Object.keys(steps).length}`} 초대 전송하기</p>
        <Progress
          value={(step / Object.keys(steps).length) * 100}
          className="w-[60%]"
          aria-label="방 만들기 진행 과정"
        />
      </header>

      {/* step 1 */}
      {step === steps.invitePerson && (
        <>
          <div>
            {stepDescription[step].split("\n").map((text, idx) => (
              <p className="text-center" key={idx}>
                {text}
              </p>
            ))}
          </div>
          <div className="flex w-full gap-4 flex-grow">
            <div className="flex-1">
              <InvitationForm invitations={invitations} setInvitations={setInvitations} />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 flex flex-col">
              <InvitationTable invitations={invitations} setInvitations={setInvitations} />
            </div>
          </div>
        </>
      )}

      {/* <Button
        className="w-full py-6"
        onClick={() =>
          setStep((prev): Step => (prev === 3 ? (prev as Step) : ((prev + 1) as Step)))
        }
      >
        다음 단계로
      </Button> */}
    </div>
  );
}
