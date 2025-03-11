"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { h4 } from "@/components/ui/typography";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [roomName, setRoomName] = useState("hello world");
  return (
    <ul>
      <li className="space-y-4">
        <Label htmlFor="roomName" className={h4}>
          회의실 이름
        </Label>
        <div className="flex gap-2">
          <Input
            id="roomName"
            className="w-64"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button>변경</Button>
        </div>
      </li>
    </ul>
  );
}
