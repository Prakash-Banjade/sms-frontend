import { ProfileAvatar } from "@/components/ui/avatar";
import Student_PersonalInfoCard from "../../components/students-management/single-student/personal-info-card";
import { useGetStudent } from "../../components/students-management/student-actions";
import { Navigate, useParams } from "react-router-dom";
import Student_ContactInfoCard from "../../components/students-management/single-student/contact-info-card";
import Student_PreviousSchoolCard from "../../components/students-management/single-student/previous-school-card";
import Student_BankDetailsCard from "../../components/students-management/single-student/bank-details-card";
import Student_IdentificationCard from "../../components/students-management/single-student/identification-card";
import Student_GuardianDetailsCard from "../../components/students-management/single-student/guardian-details-card";

export const SingleStudentPage = () => {
  const params = useParams();

  if (!params.id) return <Navigate to="/" />; // TODO: provide a meaningful route

  return <StudentProfile id={params.id} />;
};

const StudentProfile = ({ id }: { id: string }) => {
  const { data: student, isLoading } = useGetStudent({
    id,
  });

  if (isLoading) return <div className="p-5">Loading the student info...</div>

  if (!student) return <Navigate to="/" />; // TODO: provide a meaningful route

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-6">
        {student.profileImage ? (
          <img
            src={student.profileImage?.url}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <ProfileAvatar className="size-48 text-4xl" name={`${student.firstName} ${student.lastName}`} imageUrl={student.profileImage ?? undefined} />
        )}
        <div>
          <h1 className="text-3xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <div className="text-muted-foreground">
            Student ID: {student.studentId} | Roll No: {student.rollNo}
          </div>
          <div className="text-muted-foreground">
            {
              student.classRoom.parent?.name
                ? `${student.classRoom.parent.name} - ${student.classRoom.name}`
                : `${student.classRoom.name}`
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Student_PersonalInfoCard student={student} />

        <Student_ContactInfoCard student={student} />

        <Student_GuardianDetailsCard student={student} />

        <Student_IdentificationCard student={student} />

        <Student_BankDetailsCard student={student} />

        <Student_PreviousSchoolCard student={student} />
      </div>
    </div>
  )
}