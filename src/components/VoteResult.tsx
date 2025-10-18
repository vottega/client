import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type VoteResultProps = {
  yesNum: number;
  noNum: number;
  abstainNum: number;
  totalNum?: number;
  refreshIntervalMs?: number;
};

export function VoteResult({
  yesNum,
  noNum,
  abstainNum,
  totalNum,
  refreshIntervalMs = 5000,
}: VoteResultProps) {
  const [counts] = useState({ yes: yesNum, no: noNum, abstain: abstainNum });

  // 전체 투표수 계산
  const total = totalNum ?? counts.yes + counts.no + counts.abstain;
  const yesPct = total > 0 ? (counts.yes / total) * 100 : 0;
  const noPct = total > 0 ? (counts.no / total) * 100 : 0;
  const abstainPct = total > 0 ? (counts.abstain / total) * 100 : 0;

  // 실시간 업데이트 (예시: 주기적으로 데이터를 fetch)
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: 실제 API 호출로 counts 업데이트
      // 예: fetch('/api/vote/live').then(res => res.json()).then(data => setCounts(data));
    }, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  const stats = [
    { label: "찬성", value: counts.yes, pct: yesPct, color: "bg-green-500" },
    { label: "반대", value: counts.no, pct: noPct, color: "bg-red-500" },
    { label: "기권", value: counts.abstain, pct: abstainPct, color: "bg-gray-500" },
  ];

  return (
    <Card className="max-w-lg mx-auto shadow-2xl rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">실시간 투표 현황</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {stats.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{item.label}</span>
              <span>
                {item.value} ({item.pct.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${item.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end bg-white p-4">
        <Button variant="outline" size="sm">
          새로고침
        </Button>
      </CardFooter>
    </Card>
  );
}

// 🔧 Example usage with sample data
export function VoteResultExample() {
  const sampleData = {
    yesNum: 128,
    noNum: 32,
    abstainNum: 16,
    totalNum: 176,
    refreshIntervalMs: 3000,
  };

  return (
    <div className="p-4 bg-gray-50">
      <VoteResult {...sampleData} />
    </div>
  );
}
