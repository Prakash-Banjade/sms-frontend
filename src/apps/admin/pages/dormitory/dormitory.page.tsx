import DormitoriesList from "../../components/dormitory/dormitories-list"
import DormitoryForm from "../../components/dormitory/dormitory.form"

type Props = {}

export default function DormitoryPage({ }: Props) {
    return (
        <section className="@container">
            <div className="flex xl:gap-20 lg:gap-16 gap-12 2xl:flex-nowrap flex-wrap"> 
                <section className="grow">
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add Dormitory</h1>
                        <p className="text-muted-foreground">Add a new dormitory by filling out the form below.</p>
                    </section>
                    <DormitoryForm />
                </section>

                <section className="grow 2xl:max-w-[1000px]">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Dormitories List</h1>
                    </section>
                    <DormitoriesList />
                </section>
            </div>
        </section>
    )
}