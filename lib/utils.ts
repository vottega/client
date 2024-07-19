import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneRegex = new RegExp(/^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/);

export const formatPhone = (phone: string): string => {
  if (!phoneRegex.test(phone)) {
    throw new Error("올바른 전화번호 형식이 아닙니다.");
  }

  const breakpoint = phone.length === 11 ? 7 : 6;
  return `${phone.slice(0, 3)}-${phone.slice(3, breakpoint)}-${phone.slice(breakpoint)}`;
};
