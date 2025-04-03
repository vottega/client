"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ROLES, Roles } from "@/constants/role";
import { cn } from "@/lib/utils";
import { Plus, Shield, X } from "lucide-react";
import {
  Dispatch,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";

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

export const RoleList = ({
  roles,
  setRoles,
}: {
  roles: Roles;
  setRoles: Dispatch<SetStateAction<Roles>>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {[...roles.keys()].map((role, idx) => (
        <RoleBadgeWithCanVoteSwitch key={idx} variant={idx} setRoles={setRoles}>
          {role}
        </RoleBadgeWithCanVoteSwitch>
      ))}
      <AddRoleBadge setRoles={setRoles} />
    </div>
  );
};

export const BaseBadge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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

export const RoleBadgeWithCanVoteSwitch = ({
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
    <RoleBadge className="h-[54px] px-4 rounded-lg justify-between" variant={variant}>
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

export const AddRoleBadge = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { setRoles: Dispatch<SetStateAction<Roles>> }
>(({ setRoles, ...props }, ref) => {
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState("");
  const handleKeyDown = (e: KeyboardEvent) => {
    // @ts-expect-error NOTE: 한글 입력 시 keyDown 이벤트가 두 번 발생하는 이슈
    if (e.isComposing || e.keyCode === 229) return;

    if (e.key === "Enter") {
      e.preventDefault();

      if (newRole !== "") {
        setRoles((prev) => {
          const nextRoles = new Map(prev);
          if (nextRoles.has(newRole)) return nextRoles;
          nextRoles.set(newRole, { role: newRole, canVote: true });
          return nextRoles;
        });
        setNewRole("");
      } else {
        setShowInput(false);
      }
    }

    if (e.key === "Escape") {
      setShowInput(false);
    }
  };

  return (
    <BaseBadge
      className={`${!showInput && "hover:bg-accent hover:text-accent-foreground border-dashed"} ${showInput && "border-primary"} h-[54px] px-4 rounded-lg cursor-pointer`}
      ref={ref}
      {...props}
      onClick={() => setShowInput(true)}
    >
      <Plus size={16} />
      {showInput ? (
        <Input
          className="w-[200px] h-[30px] px-0 border-transparent focus-visible:ring-[initial]"
          placeholder="예: 부의장, 보조 서기, 타임키퍼"
          onChange={(e) => setNewRole(e.target.value)}
          value={newRole}
          onKeyDown={handleKeyDown}
          autoFocus
          onBlur={() => setShowInput(false)}
        />
      ) : (
        "역할 추가"
      )}
    </BaseBadge>
  );
});
AddRoleBadge.displayName = "AddRoleBadge";
