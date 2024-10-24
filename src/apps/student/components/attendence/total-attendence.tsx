
import { Card } from "@/components/ui/card";
import { TAttendenceCounts } from "@/types/attendence.type";

type TotalAttendanceProps = {
    attendenceCount: TAttendenceCounts
}

const TotalAttendence = ({ attendenceCount }: TotalAttendanceProps) => {


    return (
        <div className="flex-1 space-y-6 items-center">
            <section className="flex flex-col gap-2">

                <h2 className="text-lg font-semibold"> Current Month Report</h2>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(attendenceCount?.monthly).map(([status, count]) => (
                        <Card key={status} className="p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold capitalize">{status}</h3>
                            <p className="text-2xl text-muted-foreground">{count}</p>
                        </Card>
                    ))}
                </div>
            </section>
            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold"> Current Year Report</h2>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(attendenceCount?.yearly).map(([status, count]) => (
                        <Card key={status} className="p-4 flex flex-col gap-2">
                            <h3 className="text-lg font-semibold capitalize">{status}</h3>
                            <p className="text-2xl text-muted-foreground">{count}</p>
                        </Card>
                    ))}
                </div>
            </section>

        </div>

    );
}

export default TotalAttendence;
