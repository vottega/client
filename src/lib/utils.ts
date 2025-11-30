import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VoteResult, VoteStatus } from "./api/types/vote-service.dto";

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

export function getVoteStatusMessage(
  voteStatus: VoteStatus,
  voteResult?: VoteResult,
): string | undefined {
  switch (voteStatus) {
    case "CREATED":
      return "예정";
    case "STARTED":
      return "진행";
    case "ENDED": {
      if (voteResult === "PASSED") return "가결";
      if (voteResult === "REJECTED") return "부결";
    }
  }
}

/**
 * 두 타임스탬프를 비교하여 newTimestamp가 더 최신인지 확인
 * SSE 이벤트 처리 시 데이터 정합성 검증에 사용
 *
 * @param currentTimestamp - 현재 캐시된 데이터의 타임스탬프
 * @param newTimestamp - 새로 받은 데이터의 타임스탬프
 * @returns true면 새 데이터가 더 최신이거나 같음 (업데이트 허용), false면 오래된 데이터 (무시)
 *
 * @example
 * ```ts
 * // 타임스탬프가 있는 경우
 * isNewerOrEqual("2024-01-01T10:00:00", "2024-01-01T10:00:01") // true (새 데이터가 더 최신)
 * isNewerOrEqual("2024-01-01T10:00:01", "2024-01-01T10:00:00") // false (오래된 데이터)
 *
 * // 타임스탬프가 없는 경우 (항상 허용)
 * isNewerOrEqual(null, "2024-01-01T10:00:00") // true
 * isNewerOrEqual("2024-01-01T10:00:00", null) // true
 * ```
 */
export function isNewerOrEqual(
  currentTimestamp: string | null | undefined,
  newTimestamp: string | null | undefined,
): boolean {
  // 타임스탬프가 없으면 항상 업데이트 허용
  if (!currentTimestamp || !newTimestamp) {
    return true;
  }

  const currentTime = new Date(currentTimestamp).getTime();
  const newTime = new Date(newTimestamp).getTime();

  return newTime >= currentTime;
}
