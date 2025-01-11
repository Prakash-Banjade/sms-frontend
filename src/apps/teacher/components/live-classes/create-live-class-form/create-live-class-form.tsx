import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { z } from "zod"
import StepIndicator from "./step-indicator"
import ClassSelectionStep from "./class-selection-step"
import FinalDetailsStep from "./final-details-step"
import { startOfDayString } from "@/lib/utils"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import AppForm from "@/components/forms/app-form"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from 'uuid';

const steps = ["Class And Subject", "Final Details"]

export const createLiveClassSchema = z.object({
    classRoomId: z.string({ required_error: "Please select a class" }).uuid({ message: "Invalid class" }),
    subjectId: z.string({ required_error: "Please select a subject" }).uuid({ message: "Invalid subject" }),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long").max(500, "Description must be less than 500 characters long"),
    startImmediately: z.boolean(),
    scheduleDate: z.string({ required_error: "Please select a date" }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date',
    }).optional(),
}).superRefine((data, ctx) => {
    if (data.startImmediately && !data.scheduleDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a date",
            path: ["scheduleDate"],
        })
    }
})

export type TCreateLiveClassSchema = z.infer<typeof createLiveClassSchema>

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateLiveClassForm({ setOpen }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const client = useStreamVideoClient();
    const [call, setCall] = useState<Call | undefined>(undefined);

    const form = useForm<TCreateLiveClassSchema>({
        resolver: zodResolver(createLiveClassSchema),
        defaultValues: {
            title: "",
            description: "",
            startImmediately: false,
            scheduleDate: startOfDayString(new Date()).slice(0, -1), // removing the ending Z character
        },
    })

    const { mutateAsync } = useAppMutation();

    const onSubmit = async (data: TCreateLiveClassSchema) => {
        await mutateAsync({
            endpoint: QueryKey.ONLINE_CLASSES,
            method: 'post',
            data: {
                ...data,
                scheduleDate: data.startImmediately ? undefined : data.scheduleDate + "Z",
            },
            invalidateTags: [QueryKey.ONLINE_CLASSES],
        });

        if (data.startImmediately && !!client) {
            try {
                const id = uuidv4();

                const call = client.call("default", id);

                await call.getOrCreate({
                    data: {
                        custom: {
                            title: data.title,
                            description: data.description,
                        }
                    }
                });

                setCall(call);
                console.log(call.id)

            } catch (e) {
                console.log(e);
                toast.error("Failed to create call");
            }
        }

        setOpen(false);
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5 overflow-x-hidden p-2">
                <StepIndicator steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                    <div className="w-full flex-shrink-0 p-2">
                        <ClassSelectionStep setCurrentStep={setCurrentStep} />
                    </div>
                    <div className="w-full flex-shrink-0 p-2">
                        <FinalDetailsStep />
                    </div>
                </div>
                <div className="flex justify-between">
                    {currentStep > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                        >
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!form.watch("classRoomId") || !form.watch("subjectId")}
                        >
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <AppForm.Submit>Submit</AppForm.Submit>
                    )}
                </div>
            </form>
        </Form>
    )
}

