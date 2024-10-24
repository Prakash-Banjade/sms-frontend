import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NepaliMonths } from "@/types/attendence.type"


const AssignmentPage = () => {

    return (
        <div className="flex flex-col gap-5 py-8">
            <div className="flex justify-between px-10">

                <h2>My Attendence</h2>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'secondary'}>
                            View Monthly Attendence
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {
                            Object.values(NepaliMonths).map((month) => (
                                <DropdownMenuItem key={month}>
                                    {month}
                                </DropdownMenuItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <section className="flex gap-10 items-center ">
                <div>
                    Today attendence
                </div>
            </section>
        </div>
    )
}

export default AssignmentPage