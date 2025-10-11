import { useParams } from "react-router-dom";
import SingleAttendanceView from "../../components/students-management/single-student/single-attendance-view";
import { ProfileAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigate } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { useSidebar } from "@/components/ui/sidebar";
import { TSingleStudent } from "@/apps/admin/types/student.type";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetStudent } from "../../components/students-management/student-actions";
import { InfoField } from "../../components/students-management/single-student/info-field";
import { File } from "lucide-react";

export default function SingleStudentPage() {
  const { id } = useParams();

  const { payload } = useAuth();
  const { setDynamicBreadcrumb } = useSidebar();
  const { data: student, isLoading } = useGetStudent({
    id: id!,
    options: { enabled: !!id }
  });

  useEffect(() => {
    if (student?.account?.id) {
      setDynamicBreadcrumb([
        {
          label: student.firstName + ' ' + student.lastName,
          url: `/${payload?.role}/students/${id}`,
        }
      ]);
    };
  }, [student])

  if (isLoading) return <div className="p-5">Loading the student info...</div>

  if (!student) return <Navigate to={`/${payload?.role}/students`} />;

  return (
    <section className="container mx-auto">
      <StudentHeader student={student} />

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <StudentOverview student={student} />
        </TabsContent>

        <TabsContent value="guardians" className="mt-6">
          <StudentGuardians guardians={student.guardians} />
        </TabsContent>

        <TabsContent value="additional" className="mt-6">
          <StudentAdditional student={student} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <SingleAttendanceView accountId={student.account?.id} />
        </TabsContent>
      </Tabs>
    </section>
  )
}


function StudentHeader({ student }: { student: TSingleStudent }) {
  const fullName = `${student.firstName} ${student.lastName}`

  return (
    <div className="flex items-start gap-6 pb-6 border-b border-border">
      <ProfileAvatar
        src={getImageUrl(student.account?.profileImage?.url, 'w=160')}
        name={fullName}
        className="@lg/parent:size-40 @sm/parent:size-36 size-28 text-4xl"
        style={{
          boxShadow: "0 0 0 3px hsl(var(--card)), 0 0 0 5px hsl(var(--primary))"
        }}
      />

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">{fullName}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>Student ID: {student.studentId}</span>
              <span>•</span>
              <span>Roll No: {student.rollNo}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm capitalize">
            {student.gender}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Class:</span>{" "}
            <span className="font-medium text-foreground">{student.classRoom.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Grade:</span>{" "}
            <span className="font-medium text-foreground">{student.classRoom.parent?.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Blood Group:</span>{" "}
            <span className="font-medium text-foreground">{student.bloodGroup}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


function StudentOverview({ student }: { student: TSingleStudent }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="First Name" value={student.firstName} />
            <InfoField label="Last Name" value={student.lastName} />
            <InfoField label="Gender" value={student.gender} />
            <InfoField label="Date of Birth" value={format(new Date(student.dob), "MMM dd, yyyy")} />
            <InfoField label="Email" value={student.email} />
            <InfoField label="Phone" value={student.phone} />
            <InfoField label="Religion" value={student.religion} />
            <InfoField label="Caste" value={student.caste} />
            <InfoField label="Blood Group" value={student.bloodGroup} />
            <InfoField label="Physically Challenged" value={student.isPhysicallyChallenged} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">Current Address</dt>
              <dd className="text-sm font-medium text-foreground leading-relaxed">{student.currentAddress}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">Permanent Address</dt>
              <dd className="text-sm font-medium text-foreground leading-relaxed">{student.permanentAddress}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="National ID Card No" value={student.nationalIdCardNo} />
            <InfoField label="Birth Certificate Number" value={student.birthCertificateNumber} />
          </dl>

          {student.documentAttachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-muted-foreground mb-3">Attachments</h4>
              <div className="space-y-2">
                {student.documentAttachments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:underline w-fit"
                  >
                    <File size={16} />
                    <span className="text-blue-500">
                      {doc.originalName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


function StudentGuardians({ guardians }: { guardians: TSingleStudent["guardians"] }) {
  return (
    <div className="space-y-6">
      {guardians.map((guardian) => {
        const fullName = `${guardian.firstName} ${guardian.lastName}`

        return (
          <Card key={guardian.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <ProfileAvatar
                  src={getImageUrl(guardian?.profileImage?.url, 'w=160')}
                  name={fullName}
                  className="size-16 text-xl"
                  style={{
                    boxShadow: "0 0 0 3px hsl(var(--card)), 0 0 0 5px hsl(var(--primary))"
                  }}
                />
                <div className="flex-1">
                  <CardTitle className="text-xl">{fullName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">{guardian.relation}</Badge>
                    {guardian.receiveNotification && (
                      <Badge variant="secondary" className="text-xs">
                        Receives Notifications
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoField label="Email" value={guardian.email} />
                <InfoField label="Phone" value={guardian.phone} />
                <InfoField label="Occupation" value={guardian.occupation} />
                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                  <dt className="text-sm text-muted-foreground">Address</dt>
                  <dd className="text-sm font-medium text-foreground leading-relaxed">{guardian.address}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


function StudentAdditional({ student }: { student: TSingleStudent }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Bank Name" value={student.bankName} />
            <InfoField label="Account Name" value={student.bankAccountName} />
            <InfoField label="Account Number" value={student.bankAccountNumber} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous School</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-6">
            <InfoField label="School Name" value={student.previousSchoolName} />
            {student.previousSchoolDetails && (
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Additional Details</dt>
                <dd className="text-sm font-medium text-foreground leading-relaxed">{student.previousSchoolDetails}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {student.dormitoryRoom && (
        <Card>
          <CardHeader>
            <CardTitle>Dormitory Information</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoField label="Room Number" value={student.dormitoryRoom.roomNumber} />
          </CardContent>
        </Card>
      )}

      {student.routeStop && (
        <Card>
          <CardHeader>
            <CardTitle>Transport Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Route Stop" value={student.routeStop.name} />
              <InfoField label="Vehicle Number" value={student.routeStop.vehicle?.vehicleNumber} />
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}