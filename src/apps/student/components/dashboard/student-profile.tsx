import { ProfileAvatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { getImageUrl } from "@/lib/utils";
import { TSingleStudent } from "@/types/student.type";
import { formatDate } from "@/utils/format-date";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";

import { CalendarDays, FileDigit, GraduationCap, MapPin, Phone } from "lucide-react";

type Props = {
    student: TSingleStudent;
};

const StudentProfile = ({ student }: Props) => {
    return (
        <div className="grid lg:grid-cols-3 gap-6 p-4">
            {/* Profile Card */}
            <ProfileCard student={student} />

            {/* Detailed Information */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="personal">
                        <TabsList className="w-full justify-evenly py-6 mb-4">
                            <TabsTrigger className="px-4 py-2 rounded-md data-[state=active]:bg-muted-foreground data-[state=active]:text-primary-foreground " value="personal">Personal</TabsTrigger>
                            <TabsTrigger className="px-4 py-2 rounded-md data-[state=active]:bg-muted-foreground data-[state=active]:text-primary-foreground" value="academic">Academic</TabsTrigger>
                            <TabsTrigger className="px-4 py-2 rounded-md data-[state=active]:bg-muted-foreground data-[state=active]:text-primary-foreground" value="guardians">Guardians</TabsTrigger>
                        </TabsList>

                        {/* Tabs Content */}
                        <TabsContent value="personal" className="space-y-4">
                            <PersonalInfo student={student} />
                        </TabsContent>
                        <TabsContent value="academic" className="space-y-4">
                            <AcademicInfo student={student} />
                        </TabsContent>
                        <TabsContent value="guardians">
                            <GuardianInfo guardians={student.guardians} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProfile;

/**
 * ProfileCard Component
 */
const ProfileCard = ({ student }: { student: TSingleStudent }) => (
    <Card className="lg:col-span-1 h-fit">
        <CardHeader>
            <div className="flex items-center space-x-4">
                <ProfileAvatar
                    src={getImageUrl(student.profileImage?.url, 'w=80')}
                    className="size-20"
                    name={`${student.firstName} ${student.lastName}`}
                />
                <div className="space-y-2">
                    <CardTitle>{`${student.firstName} ${student.lastName}`}</CardTitle>
                    <CardDescription>Student ID: {student.studentId}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-3">
            <InfoRow icon={<GraduationCap />} label="Class" value={`${student.classRoom?.name} (${student.classRoom?.parent?.name})`} />
            <InfoRow icon={<FileDigit />} label="Roll Number" value={student.rollNo.toString()} />
            <InfoRow icon={<CalendarDays />} label="Date of Birth" value={formatDate({ date: new Date(student.dob) })} />
            <InfoRow icon={<MapPin />} label="Address" value={student.currentAddress} />
            <InfoRow icon={<Phone />} label="Phone" value={student.phone} />
        </CardContent>
    </Card>
);

/**
 * PersonalInfo Component
 */
const PersonalInfo = ({ student }: { student: TSingleStudent }) => (
    <div>
        <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Gender" value={student.gender} />
            <InfoItem label="Religion" value={student.religion} />
            <InfoItem label="Caste" value={student.caste} />
            <InfoItem label="Blood Group" value={student.bloodGroup} />
            <InfoItem label="Physically Challenged" value={student.isPhysicallyChallenged ? "Yes" : "No"} />
            <InfoItem label="National ID" value={student.nationalIdCardNo} />
            <InfoItem label="Birth Certificate" value={student.birthCertificateNumber} />
        </div>
        {student.additionalNotes && (
            <>
                <Separator />
                <Label>Additional Notes</Label>
                <p className="mt-1 text-sm">{student.additionalNotes}</p>
            </>
        )}
    </div>
);

/**
 * AcademicInfo Component
 */
const AcademicInfo = ({ student }: { student: TSingleStudent }) => (
    <div>
        <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Previous School" value={student.previousSchoolName} />
            {student.previousSchoolDetails && <InfoItem label="Previous School Details" value={student.previousSchoolDetails} />}
            {student.dormitoryRoom && <InfoItem label="Dormitory Room Number" value={student.dormitoryRoom.roomNumber} />}
        </div>
        {student.routeStop && (
            <div className="grid grid-cols-2 gap-4 mt-2">
                <InfoItem label="Vehicle Stop Name" value={student.routeStop.name} />
                {student.routeStop.vehicle && <InfoItem label="Vehicle Number" value={student.routeStop.vehicle.vehicleNumber} />}
            </div>
        )}
    </div>
);

/**
 * GuardianInfo Component
 */
const GuardianInfo = ({ guardians }: { guardians: TSingleStudent["guardians"] }) => (
    <>
        {guardians.map((guardian) => (
            <Card key={guardian.id} className="mb-4">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <ProfileAvatar src={getImageUrl(guardian.profileImage?.url, 'w=80')} className="size-20" name={`${guardian.firstName} ${guardian.lastName}`} />
                        <div>
                            <CardTitle>{`${guardian.firstName} ${guardian.lastName}`}</CardTitle>
                            <CardDescription>{guardian.relation}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <InfoItem label="Email" value={guardian.email} />
                    <InfoItem label="Phone" value={guardian.phone} />
                    <InfoItem label="Occupation" value={guardian.occupation} />
                    <InfoItem label="Address" value={guardian.address} />
                </CardContent>
            </Card>
        ))}
    </>
);

/**
 * InfoItem Component for Key-Value Display
 */
function InfoItem({ label, value }: { label: string; value: string | number | undefined }) {
    return (
        <div className="flex gap-2 items-center">
            <Label className="text-sm font-medium">{label}:</Label>
            <p className="mt-1 text-muted-foreground text-sm">{value || "N/A"}</p>
        </div>
    );
}

/**
 * InfoRow Component for ProfileCard Rows with Icon
 */
export function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-2">
            <p className="text-muted-foreground  size-6">{icon}</p>
            <p className="text-sm font-medium">{label}:</p>
            <p className="text-sm text-muted-foreground">{value}</p>
        </div>
    );
}
