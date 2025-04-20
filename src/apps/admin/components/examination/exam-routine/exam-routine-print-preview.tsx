import { ExamRoutineTable } from "@/apps/admin/pages/examination/exam-routine.page";
import { Button } from "@/components/ui/button";
import { TExamSubject_Raw } from "@/apps/admin/types/examination.type"
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type Props = {
    examSubjects: TExamSubject_Raw[]
}

export default function ExamRoutinePrint({ examSubjects }: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <>
            <Button onClick={() => handlePrint()} size="sm">
                <Printer /> Print Routine
            </Button>
            <section className="px-5 mt-10 hidden print:block max-w-[1000px] mx-auto" ref={contentRef}>
                <header className="flex items-center justify-between gap-2 flex-col mb-10">
                    <h1 className="text-xl font-semibold tracking-tight">{examSubjects[0]?.examType} Examination Schedule</h1>
                    <p className="text-muted-foreground text-sm">
                        Class: {examSubjects[0]?.classRoomName}
                    </p>
                </header>

                <ExamRoutineTable subjects={examSubjects} />

                <p className="mt-10 text-sm">Note: Please arrive at least 15 minutes before the scheduled exam time.</p>
            </section>
        </>
    )
}