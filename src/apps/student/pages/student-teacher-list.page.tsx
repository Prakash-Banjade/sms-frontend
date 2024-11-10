import { useGetTeachers } from "@/apps/admin/components/teachers/actions";
import { createQueryString } from "@/utils/create-query-string";
import TeacherList from "../components/teacher/teacher-card";


const StudentTeacherListPage = () => {

  const { data, isLoading } = useGetTeachers({
    queryString: createQueryString({
    }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No teacher available</div>;
  else if (data?.data.length === 0) {
    return (
      <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
        No teacher available!!
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
