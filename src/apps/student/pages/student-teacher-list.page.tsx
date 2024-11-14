import { useGetTeachers } from "@/apps/admin/components/teachers/actions";
import { createQueryString } from "@/utils/create-query-string";
import TeacherList from "../components/teacher/teacher-card";
import { St_TeacherResponse } from "@/types/teacher.type";


const StudentTeacherListPage = () => {

  const { data, isLoading } = useGetTeachers<St_TeacherResponse>({
    queryString: createQueryString({
      skipPagination: 'true',
    }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data || data?.data.length === 0) {
    return (
      <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
        No teachers available!!
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-8">
      <h2 className="text-lg font-semibold">My Teachers</h2>
      <TeacherList teachers={data.data} />
    </div >
  )
}

export default StudentTeacherListPage
