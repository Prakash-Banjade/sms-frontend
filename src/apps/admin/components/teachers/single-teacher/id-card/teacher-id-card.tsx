import { Card } from "@/components/ui/card"
import React from "react"
import "./style.css";
import { TSingleTeacherDetail } from "@/apps/admin/types/teacher.type";
import { thisSchool } from "@/CONSTANTS";

interface TeacherIdCardProps {
    teacher: TSingleTeacherDetail
}

export const TeacherIdCard = React.forwardRef<HTMLDivElement, TeacherIdCardProps>(({ teacher }, ref) => {
    return (
        <div ref={ref} className="print-area flex gap-6">
            {/* ID Card Front - Portrait */}
            <Card className="w-[2.125in] h-[3.375in] relative overflow-hidden bg-linear-to-b from-primary via-primary to-primary/90 shadow-xl">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary rounded-full -translate-y-12 translate-x-12" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary rounded-full translate-y-10 -translate-x-10" />
                    <div className="absolute top-1/2 right-0 w-16 h-16 bg-secondary rounded-full translate-x-8" />
                </div>

                {/* Header with school info */}
                <div className="relative bg-primary-foreground/95 px-3 py-2.5 flex flex-col items-center gap-1 border-b-2 border-secondary">
                    <img src="/logo.png" alt="Aayam Global School" width={45} height={45} className="object-contain" />
                    <div className="text-center">
                        <h1 className="text-[10px] font-bold text-primary leading-tight tracking-tight uppercase">{thisSchool.name}</h1>
                        <p className="text-[7px] text-primary/80 leading-tight">{thisSchool.address}</p>
                    </div>
                </div>

                {/* Teacher ID Badge */}
                <div className="relative bg-secondary text-center py-1">
                    <p className="text-[9px] font-bold text-secondary-foreground uppercase tracking-widest">Teacher ID</p>
                </div>

                {/* Photo Section */}
                <div className="relative flex justify-center py-3 px-3">
                    <div className="w-[1in] h-[1in] bg-primary-foreground rounded-md overflow-hidden border-2 border-secondary shadow-lg">
                        <img
                            src={teacher.profileImageUrl || "/placeholder.svg"}
                            alt={teacher.fullName}
                            width={120}
                            height={160}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Teacher Info */}
                <div className="relative px-3 flex-1 flex flex-col">
                    <div className="space-y-1.5 text-center">
                        <div>
                            <p className="text-[7px] text-primary-foreground/70 uppercase tracking-wide font-medium">
                                Full Name
                            </p>
                            <p className="text-[11px] font-bold text-primary-foreground leading-tight">{teacher.fullName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-center">
                            <div>
                                <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">ID Number</p>
                                <p className="text-[9px] font-semibold text-secondary">{teacher.teacherId}</p>
                            </div>
                            <div>
                                <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">Blood Group</p>
                                <p className="text-[9px] font-semibold text-secondary">{teacher.bloodGroup || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Valid Until */}
                    <div className="mt-auto pb-2">
                        <div className="bg-secondary/20 rounded px-2 py-1.5 backdrop-blur-xs text-center">
                            <p className="text-[6px] text-primary-foreground/80 uppercase tracking-wide">Valid Until</p>
                            <p className="text-[8px] font-bold text-secondary">2025-12-30</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ID Card Back - Portrait */}
            <Card className="w-[2.125in] h-[3.375in] relative overflow-hidden bg-linear-to-b from-primary/5 to-secondary/10 shadow-xl flex flex-col">
                {/* Header */}
                <div className="bg-primary px-3 py-2.5 border-b-2 border-secondary">
                    <h2 className="text-[9px] font-bold text-primary-foreground text-center uppercase tracking-wide">
                        Important Information
                    </h2>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2.5 flex-1 flex flex-col">
                    <div className="space-y-2">
                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">Date of Birth</p>
                            <p className="text-[9px] font-semibold text-foreground">{new Date(teacher.dob).toDateString()}</p>
                        </div>

                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">Address</p>
                            <p className="text-[8px] text-foreground leading-tight">Butwal, Nepal</p>
                        </div>

                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">
                                Contact Number
                            </p>
                            <p className="text-[9px] font-semibold text-foreground">{teacher.phone || "-"}</p>
                        </div>

                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">
                                Emergency Contact
                            </p>
                            <p className="text-[9px] font-semibold text-foreground">-</p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                        <p className="text-[6px] text-muted-foreground italic text-center leading-relaxed">
                            This card is the property of Aayam Global School.
                            <br />
                            If found, please return to the school office.
                        </p>
                    </div>

                    {/* School contact */}
                    <div className="mt-auto bg-primary/5 rounded px-2 py-1.5 border border-primary/20">
                        <p className="text-[6px] text-foreground/60 uppercase tracking-wide mb-0.5 text-center">School Contact</p>
                        <p className="text-[7px] font-medium text-foreground text-center">Phone: +977-XXXX-XXXXXX</p>
                        <p className="text-[7px] font-medium text-foreground text-center">Email: info@aayamglobal.edu.np</p>
                    </div>
                </div>

                {/* Footer logo */}
                <div className="absolute bottom-2 right-2 opacity-20">
                    <img src="/logo.png" alt="School Logo" width={30} height={30} className="object-contain" />
                </div>
            </Card>
        </div>
    )
})
