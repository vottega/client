import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneRegex = new RegExp(/^(01[016789]{1})[0-9]{3,4}[0-9]{4}$|^$/);

export const formatPhone = (phone: string): string => {
  if (!phoneRegex.test(phone)) {
    // TODO: 에러처리 대신할 로직
    // throw new Error("올바른 전화번호 형식이 아닙니다.");
    return phone;
  }

  const breakpoint = phone.length === 11 ? 7 : 6;
  return `${phone.slice(0, 3)}-${phone.slice(3, breakpoint)}-${phone.slice(breakpoint)}`;
};

export const getKoreanTimeWithZeroSecond = () => {
  const zeroSecond = ":00";
  return (
    new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16) + zeroSecond
  );
};
