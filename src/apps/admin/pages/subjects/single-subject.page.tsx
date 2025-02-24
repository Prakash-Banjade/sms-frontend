import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Beaker, Code, FileText, GraduationCap, ListChecks, User } from "lucide-react"
import { Navigate, useParams } from "react-router-dom"
import { useGetSubject } from "../../components/subjects/data-access";
import SubjectChapterList from "./subject-chapter-list";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-provider";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export default function SingleSubjectPage() {
    const params = useParams();

    return (
        <section className="container mx-auto">
            <SubjectOverview subjectId={params.id!} />
            <SubjectChapterList subjectId={params.id!} />
        </section>
    )
}

function SubjectOverview({ subjectId }: { subjectId: string }) {
    const { payload } = useAuth();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data: subject, isLoading } = useGetSubject({
        id: subjectId,
    });

    useEffect(() => {
        if (subject) {
            setDynamicBreadcrumb([
                {
                    label: subject.subjectName,
                    url: `/subjects/${subject.id}`,
                }
            ])
        }
    }, [subject])

    if (isLoading) return <div>Loading...</div>;

    if (!subject) return <Navigate to={`/${payload?.role}/subjects`} />;

    return (
        <>
            <Card className="mb-8 bg-secondary/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-3xl font-bold flex items-center gap-2">
                        {subject?.subjectName}
                        {
                            subject.classRoom && <Badge variant={'outline'}>
                                {subject.classRoom?.name}
                            </Badge>
                        }
                    </CardTitle>
                    <GraduationCap className="h-12 w-12 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                        <div className="flex items-center">
                            <Code className="mr-2 h-4 w-4" />
                            <span>Subject Code : {subject?.subjectCode}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>
                                Teachers : {
                                    subject.teachers?.length > 0 ? (
                                        subject.teachers?.map((teacher, ind) => (
                                            <span key={ind} className="mr-2">{teacher.firstName} {teacher.lastName}</span>
                                        ))
                                    ) : <span className="text-muted-foreground">N/A</span>
                                }
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Theory Full Mark : {subject?.theoryFM}</span>
                        </div>
                        <div className="flex items-center">
                            <Award className="mr-2 h-4 w-4" />
                            <span>Theory Pass Mark : {subject?.theoryPM}</span>
                        </div>
                        <div className="flex items-center">
                            <Beaker className="mr-2 h-4 w-4" />
                            <span>Practical Full Mark : {subject?.practicalFM}</span>
                        </div>
                        <div className="flex items-center">
                            <ListChecks className="mr-2 h-4 w-4" />
                            <span>Practical Pass Mark : {subject?.practicalPM}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="mb-8 bg-secondary/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-medium">Description</CardTitle>
                </CardHeader>
                <CardContent className="mt-5">
                    <p>{subject?.content}</p>
                </CardContent>
            </Card>
        </>
    )
}