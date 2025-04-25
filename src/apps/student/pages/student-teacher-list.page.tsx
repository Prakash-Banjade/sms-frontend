import { useGetTeachers } from "@/apps/admin/components/teachers/actions";
import { createQueryString } from "@/utils/create-query-string";
import { St_TeacherResponse } from "@/apps/admin/types/teacher.type";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { ProfileAvatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getImageUrl } from '@/lib/utils'
import { Mail, Phone } from 'lucide-react'

export default function StudentTeacherList() {

  return (
    <ContainerLayout
      title="My Teachers"
    >
      <TeachersView />
    </ContainerLayout>
  )
}

function TeachersView() {
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
    <div className="@container">
      <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 @5xl:grid-cols-4 gap-4">
        {data?.data?.map((teacher, ind) => {
          // const subjectsNames: string[] = Array.from(new Set((Array.isArray(teacher.subjects) ? teacher.subjects : JSON.parse(teacher.subjects)).map((s: any) => s.subjectName))); // Remove duplicate subjects, it shouldn't be done in frontend

          return (
            <Card key={ind} className="flex flex-col h-full">
              <CardHeader className="flex-grow">
                <div className="flex items-center justify-center space-x-4">
                  <ProfileAvatar name={teacher.teacherFullName} src={getImageUrl(teacher.profileImageUrl, 'w=120')} className="size-32" />
                </div>
              </CardHeader>
              <CardContent className='flex flex-col items-center justify-center gap-3'>
                {/* <div className='flex gap-2 items-center '>
                  <Book className=" h-4 w-4" />
                  <span className='text-muted-foreground'> {subjectsNames.join(', ')}</span>
                </div> */}
                <p className="text-lg font-semibold">{teacher.teacherFullName}</p>
                <a
                  href={`mailto:${teacher.email}`}
                  className="hover:underline hover:text-blue-500 flex items-center"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span className='text-muted-foreground break-words'>{teacher.email}</span>
                </a>
                <a
                  href={`tel:${teacher.email}`}
                  className="hover:underline hover:text-blue-500 flex items-center"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span className='text-muted-foreground'> {teacher.phone}</span>
                </a>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

