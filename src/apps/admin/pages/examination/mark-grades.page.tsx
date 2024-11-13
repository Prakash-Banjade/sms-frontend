import MarkGradesList from "../../components/examination/mark-grade/mark-grade-list";
import MarkGradeForm from "../../components/examination/mark-grade/mark-grade.form";

export default function MarkGradePage() {
    return (
        <section className="@container">
            <div className="grid @7xl:grid-cols-3 grid-cols-1 gap-12 flex-wrap">
                <section>
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add Grade</h1>
                        <p className="text-muted-foreground">Add a new mark grade.</p>
                    </section>
                    <MarkGradeForm />
                </section>

                <section className="@7xl:col-span-2">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Mark Grades List</h1>
                        <p className="text-sm text-info bg-info/10 p-1 px-3 rounded-full w-fit">
                            <strong>! Note</strong>: Mark grades are used to calculate the final mark of the student. So it is recommended to add grades once and never change.
                        </p>
                    </section>
                    <MarkGradesList />
                </section>
            </div>
        </section>
    )
}