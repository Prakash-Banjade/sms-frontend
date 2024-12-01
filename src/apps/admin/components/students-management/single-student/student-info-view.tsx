import { ProfileAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navigate } from "react-router-dom";
import { useGetStudent } from "../student-actions";
import { formatDate } from "@/utils/format-date";
import { truncateFilename } from "@/utils/truncate-file-name";
import { getImageUrl } from "@/lib/utils";
import { useEffect } from "react";

export const StudentInfoView = ({ id, setAccountId }: { id: string, setAccountId: React.Dispatch<React.SetStateAction<string | undefined>> }) => {
    const { data: student, isLoading } = useGetStudent({
        id,
    });

    useEffect(() => {
        if (student?.account?.id) setAccountId(student.account.id);
    }, [student])

    if (isLoading) return <div className="p-5">Loading the student info...</div>

    if (!student) return <Navigate to="/admin/students" />;

    return (
        <Card className="@container">
            <CardHeader className="flex @xs:flex-row flex-col items-center gap-4">
                <ProfileAvatar src={getImageUrl(student.profileImage?.url, 'w=250')} name={`${student.firstName} ${student.lastName}`} className="@lg:size-36 size-24 text-4xl" />
                <div>
                    <CardTitle className="text-2xl capitalize">{student.firstName} {student.lastName}</CardTitle>
                    <p className="text-muted-foreground">Student ID: {student.studentId}</p>
                    <Badge variant="outline" className="mt-1">
                        {
                            student.classRoom?.parent?.name
                                ? `${student.classRoom.parent.name} - ${student.classRoom.name}`
                                : `${student.classRoom.name}`
                        }
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                <section>
                    <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <InfoItem label="Gender" value={student.gender} className="capitalize" />
                        <InfoItem label="Date of Birth" value={formatDate({ date: new Date(student.dob) })} />
                        <InfoItem label="Email" value={student.email} />
                        <InfoItem label="Phone" value={student.phone} />
                        <InfoItem label="Religion" value={student.religion} className="capitalize" />
                        <InfoItem label="Caste" value={student.caste} className="capitalize" />
                        <InfoItem label="Blood Group" value={student.bloodGroup} />
                        <InfoItem label="Physically Challenged" value={student.isPhysicallyChallenged ? 'Yes' : 'No'} />
                    </div>
                </section>

                <Separator />

                <section>
                    <h3 className="font-semibold text-lg mb-2">Address Information</h3>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <InfoItem label="Current Address" value={student.currentAddress} className="capitalize" />
                        <InfoItem label="Permanent Address" value={student.permanentAddress} className="capitalize" />
                    </div>
                </section>

                <Separator />

                <section>
                    <h3 className="font-semibold text-lg mb-2">Academic Information</h3>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <InfoItem label="Class" value={
                            student.classRoom.parent?.name
                                ? `${student.classRoom.parent.name} - ${student.classRoom.name}`
                                : `${student.classRoom.name}`
                        } />
                        <InfoItem label="Roll No" value={student.rollNo.toString()} />
                        {
                            student?.dormitoryRoom && (
                                <InfoItem label="Dormitory Room" value={student.dormitoryRoom?.roomNumber.toString()} />
                            )
                        }
                        {
                            student?.routeStop && (
                                <InfoItem label="Route Stop - Vehicle" value={
                                    student.routeStop?.name + (student.routeStop?.vehicle ? ' - ' + student.routeStop?.vehicle?.vehicleNumber : '')
                                } />
                            )
                        }
                    </div>
                </section>

                <Separator />

                <section>
                    <h3 className="font-semibold text-lg mb-2">Guardian Information</h3>
                    {student.guardians.map((guardian, index) => (
                        <div key={guardian.id}>
                            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                                <InfoItem label="Name" value={`${guardian.firstName} ${guardian.lastName}`} className="capitalize" />
                                <InfoItem label="Relation" value={guardian.relation} className="capitalize" />
                                <InfoItem label="Phone" value={guardian.phone} />
                                {guardian.email && <InfoItem label="Email" value={guardian.email} />}
                                <InfoItem label="Address" value={guardian.address} className="capitalize" />
                                <InfoItem label="Occupation" value={guardian.occupation} className="capitalize" />
                                <InfoItem label="Receives Notification" value={guardian.receiveNotification ? 'Yes' : 'No'} className="capitalize" />

                            </div>
                            {index !== student.guardians.length - 1 && (
                                <Separator className="my-4" />
                            )}
                        </div>
                    ))}
                </section>

                <Separator />

                <section>
                    <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <InfoItem label="National ID Card No" value={student.nationalIdCardNo} />
                        <InfoItem label="Birth Certificate Number" value={student.birthCertificateNumber} />
                        <InfoItem label="Bank Name" value={student.bankName || 'N/A'} className="capitalize" />
                        <InfoItem label="Bank Account Number" value={student.bankAccountNumber || 'N/A'} />
                        <InfoItem label="IFSC Code" value={student.ifscCode || 'N/A'} />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Document Attachments</p>
                            <ul>
                                {
                                    student.documentAttachments?.map(attachment => (
                                        <li key={attachment.id}>
                                            <a href={attachment.url} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">
                                                {truncateFilename(attachment.originalName, 40)}
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </section>

                {
                    student?.previousSchoolName && (
                        <>
                            <Separator />

                            <section>
                                <h3 className="font-semibold text-lg mb-2">Previous School</h3>
                                <div className="grid gap-4">
                                    <InfoItem label="Name" value={student.previousSchoolName} />
                                    <InfoItem label="School Details" value={student.previousSchoolDetails || 'N/A'} />
                                </div>
                            </section>
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}

function InfoItem({ label, value, className }: { label: string; value: string, className?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={className}>{value}</p>
        </div>
    )
}