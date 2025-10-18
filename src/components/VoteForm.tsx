import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FractionVO,
  VoteResponseDTO,
  VoteSchema,
  type VoteRequestDTO,
} from "@/lib/api/types/vote-service.dto";
import { getKoreanTimeWithZeroSecond } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRoom } from "../lib/api/queries/room";

export function VoteForm({
  roomId,
  existingVote,
  readOnly = false,
  disabled = false,
  onSubmit,
}: {
  roomId: string;
  existingVote?: VoteResponseDTO;
  readOnly?: boolean;
  disabled?: boolean;
  onSubmit?: (data: VoteRequestDTO) => void;
}) {
  const form = useForm<z.infer<typeof VoteSchema>>({
    resolver: zodResolver(VoteSchema),
    defaultValues: {
      agendaName: "",
      voteName: "",
      minParticipantNumber: 0,
      minParticipantRate: { denominator: 1, numerator: 1 },
      passRate: { denominator: 2, numerator: 1 },
      reservedStartTime: getKoreanTimeWithZeroSecond(),
      startNow: true,
      isSecret: false,
      ...existingVote,
    },
  });
  const { data: room } = useRoom(roomId);
  const participantCount = room?.participants.length ?? 0;

  const ratioToQuorum = useCallback(
    (ratio: FractionVO) => {
      const { numerator, denominator } = ratio;
      return Math.min(participantCount, Math.ceil(participantCount * (numerator / denominator)));
    },
    [participantCount],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit ?? (() => {}))} className="space-y-6">
        <FormField
          control={form.control}
          name="agendaName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>안건명</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안"
                  disabled={disabled}
                  readOnly={readOnly}
                />
              </FormControl>
            </FormItem>
          )}
          rules={{ required: true }}
        />

        <FormField
          control={form.control}
          name="voteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>표결 내용</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다."
                  disabled={disabled}
                  readOnly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minParticipantNumber"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center space-y-0">
              <div className="flex flex-col">
                <FormLabel>출석 필요 인원</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="w-[102px]"
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  disabled={disabled}
                  value={field.value ?? 0}
                  readOnly={readOnly}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minParticipantRate"
          render={() => (
            <FormItem className="flex items-center justify-between gap-0">
              <div className="flex flex-col">
                <FormLabel>의사정족수</FormLabel>

                <FormDescription>
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(form.watch("minParticipantRate"))}명
                  </span>{" "}
                  이상 출석해야 회의를 진행할 수 있음
                </FormDescription>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="minParticipantRate.numerator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={disabled}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                          readOnly={readOnly}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground">/</span>
                <FormField
                  control={form.control}
                  name="minParticipantRate.denominator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={disabled}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                          readOnly={readOnly}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passRate"
          render={() => (
            <FormItem className="flex items-center justify-between gap-0">
              <div className="flex flex-col">
                <FormLabel>의결정족수</FormLabel>

                <FormDescription>
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(form.watch("passRate"))}명
                  </span>{" "}
                  이상 찬성해야 안건을 가결할 수 있음
                </FormDescription>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="passRate.numerator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={disabled}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                          readOnly={readOnly}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground">/</span>
                <FormField
                  control={form.control}
                  name="passRate.denominator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={disabled}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                          readOnly={readOnly}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="reservedStartTime"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center space-y-0">
                <FormLabel className="mr-4">시작 시간</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="w-fit"
                    onChange={(e) => {
                      field.onChange(e.target.value + ":00");
                    }}
                    disabled={disabled || form.watch("startNow")}
                    min={field.value ?? undefined}
                    value={field.value ?? undefined}
                    readOnly={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!(existingVote?.status === "ENDED") && (
            <FormField
              control={form.control}
              name="startNow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-1">바로 시작</FormLabel>
                  <FormControl>
                    <Checkbox
                      className="align-text-bottom"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setValue("reservedStartTime", getKoreanTimeWithZeroSecond());
                        }
                        field.onChange(checked);
                      }}
                      disabled={disabled || readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="isSecret"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-1">무기명</FormLabel>
              <FormControl>
                <Checkbox
                  className="align-text-bottom"
                  checked={field.value ?? undefined}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  disabled={disabled || readOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {existingVote === undefined && (
          <DialogFooter>
            <Button type="submit">생성하기</Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
