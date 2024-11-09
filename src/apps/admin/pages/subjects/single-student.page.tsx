import { Navigate, useParams } from "react-router-dom";
import { StudentInfoView } from "../../components/students-management/single-student/student-info-view";
import StudentAttendanceView from "../../components/students-management/single-student/student-attendance-view";

export const SingleStudentPage = () => {
  const params = useParams();

  if (!params.id) return <Navigate to="/admin/students" />;

  return (
    <div className="@container">
      <div className="container mx-auto flex gap-6 @4xl:flex-row flex-col items-start">
        <div className="max-w-4xl w-full">
          <StudentInfoView id={params.id} />
        </div>
        <div className="grow">
          <StudentAttendanceView />
        </div>
      </div>
    </div>
  );
};

