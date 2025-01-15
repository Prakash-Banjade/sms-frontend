import { useFormContext } from "react-hook-form"
import { TCreateLiveClassSchema } from "../live-online-class/create-live-class-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useGetAssignedClasses } from "@/apps/teacher/data-access/class-room-data-access";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function ClassSelectionStep({ setCurrentStep }: Props) {
    const form = useFormContext<TCreateLiveClassSchema>();

    const { data, isLoading } = useGetAssignedClasses({});

    return (
        <FormField
            control={form.control}
            name="classRoomId"
            render={({ field: { onChange, value } }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Select Class And Subject</FormLabel>
                    {
                        isLoading
                            ? <LoadingSkeleton />
                            : (
                                <FormControl>
                                    <RadioGroup
                                        className="grid grid-cols-3 gap-4"
                                        defaultValue={value}
                                        onValueChange={val => {
                                            const [classRoomId, subjectId] = val.split("/");
                                            onChange(classRoomId);
                                            form.setValue("subjectId", subjectId); // set the subject id
                                            if (!value) setCurrentStep(1);
                                        }}
                                    >
                                        {(data?.data ?? []).map((option) => (
                                            <FormItem key={option.id + '/' + option.subjectId}>
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={option.id + '/' + option.subjectId}
                                                        id={option.id + '/' + option.subjectId}
                                                        className="peer sr-only"
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor={option.id + '/' + option.subjectId}
                                                    className="!mt-0 flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <div className="flex">
                                                        <strong>Class:&nbsp;</strong>
                                                        <span>{option.name}</span>
                                                    </div>
                                                    <div className="!mt-3 flex">
                                                        <strong>Subject: &nbsp;</strong>
                                                        <span>{option.subjectName}</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                        ))}

                                        {
                                            data?.data?.length === 0 && (
                                                <p className="text-center text-muted py-5">
                                                    No class found. <br />
                                                    Is seems you don't own any class.
                                                </p>
                                            )
                                        }
                                    </RadioGroup>
                                </FormControl>
                            )
                    }
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function LoadingSkeleton() {
    return (
        <section className="grid grid-cols-3 gap-4">
            {
                Array.from({ length: 6 }).map((_, ind) => {
                    return <Skeleton key={ind} className="h-12 w-full" />
                })
            }
        </section>
    )
}