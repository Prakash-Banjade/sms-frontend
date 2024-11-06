import VehicleForm from "../../components/transportation/vehicles/vehicles-form"
import VehiclesList from "../../components/transportation/vehicles/vehicles-list"

export default function VehiclesPage() {
    return (
        <section className="@container">
            <div className="flex @7xl:flex-nowrap gap-12 flex-wrap">
                <section>
                    <section className='space-y-2 mb-5'>
                        <h1 className="text-2xl font-bold">Add Vehicle</h1>
                        <p className="text-muted-foreground">Add a new vehicle by filling out the form below.</p>
                    </section>
                    <VehicleForm />
                </section>

                <section className="grow">
                    <section className='space-y-3 mb-5'>
                        <h1 className="text-2xl font-bold">Vehicles List</h1>
                    </section>
                    <VehiclesList />
                </section>
            </div>
        </section>
    )
}