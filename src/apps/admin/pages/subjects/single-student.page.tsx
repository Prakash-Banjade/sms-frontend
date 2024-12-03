import { Navigate, useParams } from "react-router-dom";
import { StudentInfoView } from "../../components/students-management/single-student/student-info-view";
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view";
import { useState } from "react";

export default function SingleStudentPage() {
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
          <SingleAttendanceView accountId={accountId} />
        </div>
      </div>
    </div>
  );
};

