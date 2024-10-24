import RoomTypeList from "../../components/dormitory/room-type-list"
import RoomTypeForm from "../../components/dormitory/room-type.form"

type Props = {}

export default function RoomTypePage({ }: Props) {
    return (
        <div className="flex xl:gap-20 lg:gap-16 gap-12 flex-wrap">
            <section className="grow max-w-[600px]">
                <section className='space-y-2 mb-5'>
                    <h1 className="text-2xl font-bold">Add Room Type</h1>
                    <p className="text-muted-foreground">Add a new room type by filling out the form below.</p>
                </section>
                <RoomTypeForm />
            </section>

            <section className="grow">
                <section className='space-y-3 mb-5'>
                    <h1 className="text-2xl font-bold">Room Types List</h1>
                </section>
                <RoomTypeList />
            </section>
        </div>
    )
}