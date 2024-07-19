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
import { toast } from "@/components/ui/use-toast";
import { formatPhone, phoneRegex } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, X } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";
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
    .regex(phoneRegex, { message: "유효하지 않은 전화번호입니다." }),
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (invitations.find(({ phone }) => phone === data.phone)) {
      toast({
        title: "올바르지 않은 전화번호",
        description: "이미 등록된 전화번호예요. 전화번호를 확인해주세요.",
      });

      return;
    }

    setInvitations((prev: Invitation[]) => [...prev, data]);
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
                <Input {...field} placeholder="전화번호를 입력해주세요." />
              </FormControl>
              <FormDescription>
                전화번호가 없으면 추후 다른 방법으로 초대할 수 있어요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">추가하기</Button>
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

  const onClickDeleteButton = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    if (index < 0 || index >= invitations.length) {
      return;
    }
    setInvitations([...invitations.slice(0, index), ...invitations.slice(index + 1)]);
  };

  function TableRowInvitation({ invitation, idx }: { invitation: Invitation; idx: number }) {
    const [isHover, setIsHover] = useState<boolean>();
    const toggleHover = () => {
      setIsHover((prev) => !prev);
    };
    console.log("rendering: ", idx);

    return (
      <TableRow onMouseOver={toggleHover} onMouseOut={toggleHover} className="relative">
        <TableCell className="font-medium">
          <span className="animate-fadein">{invitation.name}</span>
        </TableCell>
        <TableCell className={`text-right transition-transform ${isHover && "-translate-x-4"}`}>
          <span className="animate-fadein">{formatPhone(invitation.phone)}</span>
        </TableCell>
        {isHover && (
          <Button
            className="absolute right-0 bottom-[50%] translate-y-1/2"
            size={"icon-sm"}
            onClick={(e) => {
              onClickDeleteButton(e, idx);
            }}
          >
            <X size={16} />
          </Button>
        )}
      </TableRow>
    );
  }

  return (
    <Table>
      <TableCaption>현재까지 초대된 목록이에요.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">성함</TableHead>
          <TableHead className="text-right">전화번호</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            {me.name}
            <Badge className="align-bottom">
              <Award size={14} />
            </Badge>
          </TableCell>
          <TableCell className="text-right">{formatPhone(me.phone)}</TableCell>
        </TableRow>

        {[...Array(2)].map((_, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">
              {others[idx] ? (
                <span className="animate-fadein">{others[idx].name}</span>
              ) : (
                <Skeleton className="h-6 w-10" />
              )}
            </TableCell>
            <TableCell className="text-right">
              {others[idx] ? (
                <span className="animate-fadein">{formatPhone(others[idx].phone)}</span>
              ) : (
                <Skeleton className="h-6 w-28 ml-auto" />
              )}
            </TableCell>
          </TableRow>
        ))}

        {others.slice(2).map((invitation, idx) => (
          <TableRowInvitation key={invitation.phone} invitation={invitation} idx={idx} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={1}>총 인원 수</TableCell>
          <TableCell className="text-right">{invitations.length}명</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
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
    <div className="py-20 px-4 flex flex-col items-center h-screen gap-10">
      <header className="w-full flex flex-col items-center gap-4">
        <p className="text-center">{`${step} / ${Object.keys(steps).length}`}</p>
        <Progress value={(step / Object.keys(steps).length) * 100} className="w-[60%]" />
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
            <div className="flex-1">
              <InvitationTable invitations={invitations} setInvitations={setInvitations} />
            </div>
          </div>
        </>
      )}

      <Button
        className="w-full py-6"
        onClick={() =>
          setStep((prev): Step => (prev === 3 ? (prev as Step) : ((prev + 1) as Step)))
        }
      >
        다음 단계로
      </Button>
    </div>
  );
}
