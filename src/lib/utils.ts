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

export function parseLocalDateTime(localDateTime: string): Date {
  const date = new Date(localDateTime);
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 LocalDateTime 문자열입니다.");
  }
  return date;
}

export function formatDate(localDateTime: string, locale: string = "ko-KR"): string {
  const date = parseLocalDateTime(localDateTime);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatTime(localDateTime: string, locale: string = "ko-KR"): string {
  const date = parseLocalDateTime(localDateTime);
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDateTime(localDateTime: string, locale: string = "ko-KR"): string {
  const datePart = formatDate(localDateTime, locale);
  const timePart = formatTime(localDateTime, locale);
  return `${datePart} ${timePart}`;
}
