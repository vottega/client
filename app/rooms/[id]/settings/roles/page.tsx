import { RoleList } from "@/app/rooms/RoleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";

export default function Page() {
  return (
    <ul>
      <li className="space-y-4">
        <TypographyH4>참여자 역할</TypographyH4>
        <Card>
          <CardContent className="p-4">
            <RoleList />
          </CardContent>
        </Card>
        <Button className="block ml-auto">적용하기</Button>
      </li>
    </ul>
  );
}
