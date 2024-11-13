import DormitoriesList from "../../components/dormitory/dormitories-list"
import DormitoryForm from "../../components/dormitory/dormitory.form"

type Props = {}

export default function DormitoryPage({ }: Props) {
    return (
        <section className="@container">
            <div className="flex @7xl:flex-nowrap gap-12 flex-wrap">  
                <section className="grow">
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add Dormitory</h1>
                        <p className="text-muted-foreground">Add a new dormitory by filling out the form below.</p>
                    </section>
                    <DormitoryForm />
                </section>

                <section className="grow @7xl:max-w-[1000px]">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Dormitories List</h1>
                    </section>
                    <DormitoriesList />
                </section>
            </div>
        </section>
    )
}