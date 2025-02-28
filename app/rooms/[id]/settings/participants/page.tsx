import { ParticipantList } from "@/app/rooms/[id]/settings/participants/ParticipantList";
import { TypographyH4 } from "@/components/ui/typography";

export default function Page() {
  return (
    <ul>
      <li>
        <TypographyH4>참여자</TypographyH4>
        <ParticipantList />
      </li>
    </ul>
  );
}
