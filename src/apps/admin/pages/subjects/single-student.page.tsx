import { Navigate, useParams } from "react-router-dom";
import { StudentInfoView } from "../../components/students-management/single-student/student-info-view";
import StudentAttendanceView from "../../components/students-management/single-student/student-attendance-view";
import { useState } from "react";

export const SingleStudentPage = () => {
  const params = useParams();
  const [accountId, setAccountId] = useState<string | undefined>(undefined); // used to fetch attendance data

  if (!params.id) return <Navigate to="/admin/students" />;

  return (
    <div className="@container">
      <div className="container mx-auto flex gap-6 @4xl:flex-row flex-col items-start">
        <div className="max-w-4xl w-full">
          <StudentInfoView id={params.id} setAccountId={setAccountId} />
        </div>
        <div className="grow">
          <StudentAttendanceView accountId={accountId} />
        </div>
      </div>
    </div>
  );
};

