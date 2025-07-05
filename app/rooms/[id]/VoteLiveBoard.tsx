"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// 👥 참여자 타입 정의
export type Participant = {
  id: string;
  name: string;
  hasVoted: boolean;
  isOnline: boolean;
  votedAt?: string;
};

export type VoteLiveBoardDialogProps = {
  participants: Participant[];
  refreshIntervalMs?: number;
};

export function VoteLiveBoardDialog({
  participants: initialList,
  refreshIntervalMs = 5000,
}: VoteLiveBoardDialogProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialList);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 요약 수치 계산
  const total = participants.length;
  const complete = participants.filter((p) => p.hasVoted).length;
  const onlineCount = participants.filter((p) => p.isOnline).length;
  const percent = total ? Math.round((complete / total) * 100) : 0;

  // 실시간 갱신 시각 표시
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: fetch('/api/vote/participants')...
      // setParticipants(fetchedParticipants);
      setLastUpdated(new Date());
    }, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="uppercase tracking-wider">
          Live Vote Board
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header: LIVE status + stats */}
        <DialogHeader className="bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-extrabold text-gray-900 flex gap-2">
              실시간 투표 현황
              <p className="flex text-base items-center gap-1 text-red-500 animate-pulse font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>LIVE</span>
              </p>
            </DialogTitle>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            마지막 갱신: {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ko })}
          </p>
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            {[
              { label: "총 참여자", value: total },
              { label: "온라인", value: onlineCount },
              { label: "투표 완료", value: complete },
              { label: "진행률", value: `${percent}%` },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xl font-semibold text-gray-800">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content: Grid of Participants */}
        <div className="p-6 bg-white grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg shadow-sm transition hover:scale-105",
                p.hasVoted ? "bg-blue-100" : "bg-pink-100",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    p.isOnline ? "bg-green-500" : "bg-gray-400",
                  )}
                ></span>
                <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  p.hasVoted ? "bg-blue-200 text-blue-800" : "bg-pink-200 text-pink-800",
                )}
              >
                {p.hasVoted ? "완료" : "대기"}
              </span>
            </div>
          ))}
        </div>

        {/* Footer: Refresh */}
        <DialogFooter className="p-4 bg-white flex justify-end">
          <Button variant="outline" onClick={() => setLastUpdated(new Date())}>
            새로고침
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Example usage
export function VoteLiveBoardDialogExample() {
  const sample: Participant[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `${i + 1}`,
    name: `참여자 ${i + 1}`,
    hasVoted: i % 2 === 0,
    isOnline: i % 3 !== 0,
  }));
  return (
    <div className="p-4 bg-gray-100 flex justify-center">
      <VoteLiveBoardDialog participants={sample} refreshIntervalMs={5000} />
    </div>
  );
}
