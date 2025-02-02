import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileAvatar } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils"
import { Link } from "react-router-dom"
import { QueryKey } from "@/react-query/queryKeys"
import { useAuth } from "@/contexts/auth-provider"
import { useFetchData } from "@/hooks/useFetchData"
import { Role } from "@/types/global.type"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type TBirthDayResponse = {
    totalCount: number;
    data: {
        id: string,
        name: string,
        role: Role,
        profileImageUrl: string | null,
        studentId: string | null,
        teacherId: string | null,
        staffId: string | null,
    }[]
}

export default function TodayBirthDays() {
    const { data: birthdays, isLoading } = useFetchData<TBirthDayResponse>({
        endpoint: QueryKey.DASHBOARD + '/birthdays',
        queryKey: [QueryKey.DASHBOARD, 'birthdays'],
    });
    const { payload } = useAuth()

    if (isLoading) return <LoadingSkeleton />;

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Today Brithday Members</CardTitle>
                <CardDescription className="text-muted-foreground">Let's celebrate the brithday of our members</CardDescription>
            </CardHeader>
            <CardContent>
                {
                    !!birthdays?.data.length ? (
                        <section className="flex gap-3 flex-wrap">
                            {
                                birthdays?.data.map((member) => {
                                    const link = member.role === Role.STUDENT
                                        ? `/${payload?.role}/students/${member.studentId}`
                                        : member.role === Role.TEACHER
                                            ? `/${payload?.role}/teachers/${member.teacherId}`
                                            : `/${payload?.role}/staffs/${member.staffId}`

                                    return (
                                        <Link to={link} key={member.id}>
                                            <Card className="group p-3 px-5 border-none bg-secondary/20 flex flex-col items-center justify-center">
                                                <ProfileAvatar name={member.name} src={getImageUrl(member.profileImageUrl, 'w=65')} className="size-16 mb-2" />
                                                <span className="text-sm pb-1 group-hover:underline">{member.name}</span>
                                                <Badge variant={'outline'} className="capitalize">{member.role}</Badge>
                                            </Card>
                                        </Link>
                                    )
                                })
                            }
                        </section>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-8">No birthdays today!</p>
                    )
                }
            </CardContent>
            {
                !!birthdays?.data.length && (
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                        <span>Total: {birthdays?.totalCount}</span>
                    </CardFooter>
                )
            }
        </Card>
    )
}

const LoadingSkeleton = () => {
    return (
        <Card className="w-full h-fit">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-7 w-48" />
                </CardTitle>
                <Skeleton className="h-5 max-w-96 w-[40%] mt-1" />
            </CardHeader>
            <CardContent>
                <section className="flex gap-3 flex-wrap">
                    {
                        Array.from({ length: 2 }).map((_, index) => (
                            <Card key={index} className="group p-3 px-5 border-none bg-secondary/20 flex flex-col items-center justify-center w-40">
                                <Skeleton className="size-16 mb-2 rounded-full" />
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-4 w-20 mt-1" />
                            </Card>
                        ))
                    }
                </section>
            </CardContent>
        </Card>
    )
}