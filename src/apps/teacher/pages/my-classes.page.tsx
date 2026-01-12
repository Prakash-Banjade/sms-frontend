import { useGetClasses } from "@/apps/admin/components/class-rooms/actions";
import { TClassesResponse_TeacherView } from "@/apps/admin/types/class.type";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { createQueryString } from "@/utils/create-query-string";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

export default function MyClassesPage() {
    return (
        <ContainerLayout
            title="My Classes"
            description="View and manage your classes"
        >
            <section className="@container">
                <Content />
            </section>
        </ContainerLayout>
    )
}

function Content() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClasses<TClassesResponse_TeacherView>({
        queryString: createQueryString({
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            facultyId: searchParams.get('facultyId'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data || !data.data?.length) return (
        <div className="mt-20 text-muted-foreground text-sm text-center">
            No assigned class or you don't have any schedule for the class.
        </div>
    )

    return (
        <>
            <section className="grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-6 mb-8">
                {
                    classTeacherFirstClases(data.data).map((classRoom) => {
                        let viewStudentsLink = `/teacher/students?facultyId=${classRoom.facultyId}&classRoomId=${classRoom.parentId ? classRoom.parentId : classRoom.id}`;

                        if (classRoom.parentId) {
                            viewStudentsLink += `&sectionId=${classRoom.id}`
                        }

                        return (
                            <Card className="overflow-hidden flex flex-col" key={classRoom.id}>
                                <CardHeader className="bg-secondary/20 pb-4 flex items-baseline flex-wrap gap-1 justify-between flex-row">
                                    <CardTitle className="mt-2">{classRoom.name}</CardTitle>
                                    <Badge className="w-fit" variant={classRoom.isClassTeacher ? "default" : "outline-solid"}>
                                        {
                                            classRoom.isClassTeacher ? "Class Teacher" : "Subject Teacher"
                                        }
                                    </Badge>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm" title="Students Count">
                                                Males: {classRoom.totalMaleStudentsCount} •
                                                Females: {classRoom.totalFemaleStudentsCount} •
                                                Others: {+classRoom.totalStudentsCount - +classRoom.totalMaleStudentsCount - +classRoom.totalFemaleStudentsCount}
                                            </div>
                                        </div>
                                        {
                                            classRoom.location && (
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-muted-foreground" />
                                                    Room: <span className="text-sm">Room {classRoom.location}</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t bg-secondary/20 px-6 py-3 mt-auto">
                                    {
                                        classRoom.isClassTeacher === 1 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/teacher/my-classes/${classRoom.id}`}>View Details</Link>
                                            </Button>
                                        )
                                    }
                                    <Button size="sm" asChild className="ml-auto">
                                        <Link to={viewStudentsLink}>View Students</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </section>
            <DataTablePagination meta={data.meta} />
        </>
    )
}

function classTeacherFirstClases(classes: TClassesResponse_TeacherView["data"]) {
    return classes.sort((a, b) => b.isClassTeacher - a.isClassTeacher);
}