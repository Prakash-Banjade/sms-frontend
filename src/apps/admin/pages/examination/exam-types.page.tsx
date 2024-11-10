import ExamTypesList from "../../components/examination/exam-type/exam-type-list";
import ExamTypeForm from "../../components/examination/exam-type/exam-type.form";

export default function ExamTypesPage() {
    return (
        <section className="@container">
            <div className="flex @4xl:flex-nowrap gap-12 flex-wrap">
                <section className="grow">
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add Exam Type</h1>
                        <p className="text-muted-foreground">Add a new exam type by filling out the form below.</p>
                    </section>
                    <ExamTypeForm />
                </section>

                <section className="grow">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Exam Types List</h1>
                    </section>
                    <ExamTypesList />
                </section>
            </div>
        </section>
    )
}