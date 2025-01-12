import { cn } from "@/lib/utils"
import './style.css'
import { useFormContext } from "react-hook-form";
import { TCreateLiveClassSchema } from "../live-online-class/create-live-class-form";

interface StepIndicatorProps {
    steps: string[]
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function StepIndicator({ steps, currentStep, setCurrentStep }: StepIndicatorProps) {
    const form = useFormContext<TCreateLiveClassSchema>();

    return (
        <div className="flex gap-4 mb-8">
            {steps.map((step, index) => (
                <button
                    type="button"
                    key={step}
                    className="flex flex-col items-center grow hover:bg-secondary/40 disabled:hover:bg-transparent rounded-md py-1 pt-4 transition-all"
                    onClick={() => {
                        setCurrentStep(index)
                    }}
                    disabled={!form.watch("classRoomId") || !form.watch("subjectId")}
                >
                    <div className="relative">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                                index <= currentStep
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted bg-background text-muted-foreground"
                            )}
                        >
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="absolute top-1/2 w-full h-0.5 bg-muted -z-10" />
                        )}
                    </div>
                    <span className="mt-2 text-sm">{step}</span>
                    {index === currentStep && (
                        <section className="w-full">
                            <div className="underline w-full h-0.5 bg-primary mt-2" />
                        </section>
                    )}
                </button>
            ))}
        </div>
    )
}

