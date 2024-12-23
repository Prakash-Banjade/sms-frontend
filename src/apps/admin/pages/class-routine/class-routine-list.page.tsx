import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClassRoutineSearchFilters from "../../components/class-routine/search-filters"
import { useMemo } from "react"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { ClassRoutinesDisplayList } from "../../components/class-routine/routines-display-list"
import { EDayOfWeek, Role } from "@/types/global.type"
import { useAuth } from "@/contexts/auth-provider"
import { isAdmin } from "@/utils/role-ckeck"

export default function ClassRoutineListPage() {
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
                isAdmin(payload) && <ClassRoutineSearchFilters />
            }
            <Tabs defaultValue={defaultTab} className="mt-6" onValueChange={setCurrentTab}>
                <TabsList className="w-full h-auto flex flex-wrap gap-2">
                    {
                        Object.values(EDayOfWeek).map((day) => (
                            <TabsTrigger key={day} value={day} className="capitalize flex-1">
                                {day}
                            </TabsTrigger>
                        ))
                    }
                </TabsList>
            </Tabs>

            {/* if role is student or teacher, no classRoomId is needed, but for admin classRoomId is required */}
            {
                (
                    (isAdmin(payload) && searchParams.get("classRoomId"))
                    || payload?.role === Role.STUDENT
                    || payload?.role === Role.TEACHER
                ) ?
                    <ClassRoutinesDisplayList />
                    : <div className="mt-16 text-muted-foreground text-center">**Select a class room to view class routines**</div>
            }
        </div>

    )
}