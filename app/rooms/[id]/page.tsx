"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, Data } from "@/components/ui/combobox";
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
import { ROLES } from "@/constants/role";
import { cn, formatPhone, phoneRegex } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Award, ChevronLeft, ChevronRight, CircleCheck, CircleX, Trash2 } from "lucide-react";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
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
type Role = {
  value: string;
  canVote: boolean;
};
type Roles = Map<string, Role>;
type Participant = Invitation & {
  affiliation?: string;
  role: string;
};

export function InvitationForm({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
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

  function onSubmit(data: Invitation) {
    if (participants.find(({ phone }) => phone === data.phone)) {
      setNotification("fail");
    } else {
      const newData: Participant = { ...data, role: "회의자" };
      setParticipants((prev: Participant[]) => [...prev, newData]);
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
                <Input {...field} placeholder="성함을 입력해주세요." autoFocus />
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

export function ParticipantTable({
  participants,
  setParticipants,
}: {
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const [me, ...others] = useMemo(() => participants, [participants]);
  const prevparticipantsLength = useRef<number>(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const selectedCount = useMemo(() => selected.size, [selected]);
  const skeletonFill = useMemo(() => Math.max(3 - others.length, 0), [others]);
  const tBody = useRef<HTMLTableSectionElement>(null);
  const checkboxSelectAll = useRef<HTMLButtonElement>(null);
  const checkboxes = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (participants.length > prevparticipantsLength.current) {
      tBody.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
    prevparticipantsLength.current = participants.length;
  }, [participants]);

  const onClickDeleteButton = (e: MouseEvent<HTMLButtonElement>) => {
    setParticipants((participants: Participant[]) =>
      participants.filter((_, idx) => !selected.has(idx)),
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

          {others.map((Participant, idx) => (
            <TableRow key={Participant.phone} className="relative h-[60px] z-0">
              <TableCell>
                <Checkbox
                  className="align-text-bottom"
                  aria-label="행 선택"
                  onCheckedChange={(checked) => {
                    onCheckedChange(checked, idx + 1);
                  }}
                  id={Participant.phone}
                  ref={(checkbox) => {
                    // TODO: do sth on every rerender, to many calls maybe?
                    if (checkbox) {
                      checkboxes.current.set(Participant.phone, checkbox);
                    } else {
                      checkboxes.current.delete(Participant.phone);
                    }
                  }}
                />
                <Label
                  htmlFor={Participant.phone}
                  className="block w-full h-[60px] absolute bottom-0 left-0 cursor-pointer"
                ></Label>
              </TableCell>
              <TableCell className="font-medium">
                <span className="animate-fadein">{Participant.name}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="animate-fadein">{formatPhone(Participant.phone)}</span>
              </TableCell>
            </TableRow>
          ))}

          {[...Array(skeletonFill)].map((_, idx) => (
            <TableRow key={participants.length + idx + 1} className="relative h-[60px] z-0">
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
            <TableCell className="text-right">{participants.length}명</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export function RoleTable({
  participants,
  setParticipants,
  roles,
}: {
  participants: Participant[];
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
  roles: Roles;
}) {
  const [me, ...others] = useMemo(() => participants, [participants]);
  const datas = useMemo<Data[]>(
    () =>
      [...roles].map(([_, { value }]) => ({
        label: value,
        value,
      })),
    [roles],
  );
  // TODO: 인원 검색

  const onRoleChange = (role: string, idx: number) => {
    console.assert(idx in participants, "배열이 제대로 관리되고 있지 않음");
    setParticipants((prev) => {
      const nextParticipants = [...prev];
      nextParticipants[idx].role = role;
      return nextParticipants;
    });
  };
  return (
    <Table>
      <TableCaption className="sticky bottom-0 bg-white mt-0 pt-4 z-10">
        현재까지 초대된 목록이에요.
      </TableCaption>

      <TableHeader className="sticky top-0 bg-white z-10">
        <TableRow>
          <TableHead>성함</TableHead>
          <TableHead>전화번호</TableHead>
          <TableHead className="text-right">역할</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="h-[60px] relative">
          <TableCell className="font-medium">
            {me.name}
            <Badge className="align-bottom">
              <Award size={14} />
            </Badge>
          </TableCell>
          <TableCell>{formatPhone(me.phone)}</TableCell>
          <TableCell className="text-right">
            <Combobox
              datas={datas}
              defaultValue={me.role}
              onValueChange={(value: string) => {
                onRoleChange(value, 0);
              }}
            />
          </TableCell>
        </TableRow>

        {others.map((other, idx) => (
          <TableRow key={other.phone} className="relative h-[60px] z-0">
            <TableCell className="font-medium">
              <span className="animate-fadein">{other.name}</span>
            </TableCell>
            <TableCell>
              <span className="animate-fadein">{formatPhone(other.phone)}</span>
            </TableCell>
            <TableCell className="text-right">
              <Combobox
                datas={datas}
                defaultValue={other.role}
                onValueChange={(value: string) => {
                  onRoleChange(value, idx + 1);
                }}
              />
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
          <TableCell className="text-right">{participants.length}명</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export function RoleAuthorization({
  roles,
  setRoles,
}: {
  roles: Roles;
  setRoles: Dispatch<SetStateAction<Roles>>;
}) {
  const onCheckedChange = (checked: CheckedState, role: string) => {
    setRoles((prev) => {
      const nextRoles = new Map(prev);
      const target = nextRoles.get(role);
      const canVote = checked === true;
      if (target) {
        target.canVote = canVote;
        console.log("canVote changed to: ", target.canVote);
      }
      return nextRoles;
    });
  };

  return (
    <ul className="grid grid-cols-2 gap-4">
      {[...roles].map(([label, role]) => (
        <li key={role.value}>
          <ButtonLabeledCheckbox
            id={role.value}
            label={label}
            onCheckedChange={(checked) => {
              onCheckedChange(checked, role.value);
            }}
            checked={roles.get(label)?.canVote}
          />
        </li>
      ))}
    </ul>
  );
}

export function ButtonLabeledCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked?: CheckedState;
  onCheckedChange: (checked: CheckedState) => void;
}) {
  type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
  const [labelVariant, setLabelVariant] = useState<ButtonVariant>(checked ? "default" : "outline");
  return (
    <>
      <Label
        htmlFor={id}
        className={cn(buttonVariants({ variant: labelVariant }), "w-full cursor-pointer")}
      >
        {label}
        <CircleCheck color="hsl(var(--background))" strokeWidth={1} />
      </Label>
      <Checkbox
        className="sr-only"
        id={id}
        onCheckedChange={(checked) => {
          onCheckedChange(checked);
          if (checked) {
            setLabelVariant("default");
          } else {
            setLabelVariant("outline");
          }
        }}
        checked={checked}
      />
    </>
  );
}

export function AuthorizationTable({
  roles,
  participants,
}: {
  roles: Roles;
  participants: Participant[];
}) {
  const [me, ...others] = useMemo(() => participants, [participants]);
  return (
    <>
      <Table>
        <TableCaption className="sticky bottom-0 bg-white mt-0 pt-4 z-10">
          현재까지 초대된 목록이에요.
        </TableCaption>

        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>성함</TableHead>
            <TableHead>역할</TableHead>
            <TableHead className="text-right">투표권</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow className="h-[60px] relative">
            <TableCell className="font-medium">
              {me.name}
              <Badge className="align-bottom">
                <Award size={14} />
              </Badge>
            </TableCell>
            <TableCell>{me.role}</TableCell>
            <TableCell className="text-right">
              {roles.get(me.role)?.canVote ? "가능" : "불가"}
            </TableCell>
          </TableRow>

          {others.map((other, idx) => (
            <TableRow key={other.phone} className="relative h-[60px] z-0">
              <TableCell className="font-medium">
                <span className="animate-fadein">{other.name}</span>
              </TableCell>
              <TableCell>
                <span className="animate-fadein">{other.role}</span>
              </TableCell>
              <TableCell className="text-right">
                {roles.get(other.role)?.canVote ? "가능" : "불가"}
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
            <TableCell className="text-right">{participants.length}명</TableCell>
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
  const stepInfo = {
    [steps.invitePerson]: {
      title: "초대 전송하기",
      description:
        "QR코드를 전송할 사람을 입력해주세요.\n인원은 방을 개설한 후 언제든 새로 추가할 수 있어요.",
    },
    [steps.chooseRole]: {
      title: "역할 분담하기",
      description:
        "각자의 역할을 분담해주세요.\n다음 단계에서 역할마다 투표권을 다르게 부여할 수 있어요.",
    },
    [steps.authorizeRole]: {
      title: "투표권 부여하기",
      description: "역할마다 투표권을 다르게 부여할 수 있어요.",
    },
  };
  type Step = (typeof steps)[keyof typeof steps];

  const [step, setStep] = useState<Step>(steps.invitePerson);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: "류기현",
      phone: "01087654321",
      role: "의장",
    },
  ]);
  const [roles, setRoles] = useState<Roles>(ROLES);

  return (
    <div className="py-10 px-4 flex flex-col items-center h-screen gap-10">
      <header className="w-full flex items-center gap-2 px-4">
        <Button
          onClick={() => setStep((prev) => Math.max(prev - 1, 1) as Step)}
          disabled={step === steps.invitePerson}
        >
          <ChevronLeft className="h-4 w-4" />
          이전 단계로
        </Button>

        <div className="flex flex-col gap-2 flex-1">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">방 이름</h2>
          <Progress
            value={(step / Object.keys(steps).length) * 100}
            className="w-[60%] m-auto"
            aria-label="방 만들기 진행 과정"
          />
          <p className="text-center text-sm text-muted-foreground">
            {`${step} / ${Object.keys(steps).length}`} {stepInfo[step].title}
          </p>
        </div>

        <Button onClick={() => setStep((prev) => Math.min(prev + 1, 3) as Step)}>
          다음 단계로
          <ChevronRight className="h-4 w-4" />
        </Button>
      </header>

      <div>
        {stepInfo[step].description.split("\n").map((text, idx) => (
          <p className="text-center" key={idx}>
            {text}
          </p>
        ))}
      </div>

      {/* step 1 */}
      {step === steps.invitePerson && (
        <>
          <div className="flex w-full gap-4 flex-grow">
            <div className="flex-1">
              <InvitationForm participants={participants} setParticipants={setParticipants} />
            </div>
            <Separator orientation="vertical" />
            <div className="flex-1 flex flex-col">
              <ParticipantTable participants={participants} setParticipants={setParticipants} />
            </div>
          </div>
        </>
      )}

      {/* step 2 */}
      {step === steps.chooseRole && (
        <>
          <div className="w-full">
            <RoleTable
              participants={participants}
              setParticipants={setParticipants}
              roles={roles}
            />
          </div>
        </>
      )}

      {/* step 3 */}
      {step === steps.authorizeRole && (
        <>
          <div className="w-full">
            <RoleAuthorization roles={roles} setRoles={setRoles} />
            <AuthorizationTable roles={roles} participants={participants} />
          </div>
        </>
      )}
    </div>
  );
}
