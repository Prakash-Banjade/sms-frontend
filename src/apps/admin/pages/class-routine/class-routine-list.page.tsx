import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClassRoutineSearchFilters from "../../components/class-routine/search-filters"
import { useMemo } from "react"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { ClassRoutinesDisplayList } from "../../components/class-routine/routines-display-list"
import { EDayOfWeek, Role } from "@/types/global.type"
import { useAuth } from "@/contexts/auth-provider"

type Props = {}

export default function ClassRoutineListPage({ }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const { payload } = useAuth()

    const defaultTab = useMemo(() => {
        const day = searchParams.get("dayOfTheWeek");
        if (day) {
            return Object.values(EDayOfWeek).includes(day as EDayOfWeek) ? day : EDayOfWeek.MONDAY
        }
        return EDayOfWeek.MONDAY;
    }, [searchParams])

    const setCurrentTab = (day: string) => {
        setSearchParams("dayOfTheWeek", day);
    }

    return (
        <div className="container mx-auto">
            {
                payload?.role === Role.ADMIN && <ClassRoutineSearchFilters />
            }
            <Tabs defaultValue={defaultTab} className="w-full mt-6" onValueChange={setCurrentTab}>
                <TabsList className="w-full py-6">
                    {
                        Object.values(EDayOfWeek).map((day) => (
                            <TabsTrigger key={day} value={day} className="capitalize px-5 py-2 text-base">
                                {day}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
            </Tabs>

            {
                searchParams.get("classRoomId") ?
                    <ClassRoutinesDisplayList />
                    : <div className="mt-16 text-muted-foreground text-center">**Select a class room to view class routines**</div>
            }
        </div>

    )
}