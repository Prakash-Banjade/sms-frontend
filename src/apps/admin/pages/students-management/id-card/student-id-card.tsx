import { Card } from "@/components/ui/card"
import { TSingleStudent } from "../../../types/student.type"
import React from "react"
import "./style.css";

interface StudentIdCardProps {
    student: TSingleStudent
}

export const StudentIdCard = React.forwardRef<HTMLDivElement, StudentIdCardProps>(({ student }, ref) => {
    return (
        <div ref={ref} className="print-area flex gap-6">
            {/* ID Card Front */}
            <Card className="w-[3.375in] h-[2.125in] relative overflow-hidden bg-linear-to-br from-primary via-primary to-primary/90 shadow-xl">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-full translate-y-12 -translate-x-12" />
                </div>

                <div className="relative bg-primary-foreground/95 px-3 py-2 flex items-center gap-2 border-b-2 border-secondary">
                    <img src="/logo.png" alt="Loomis Global School" width={40} height={40} className="object-contain" />
                    <div className="flex-1">
                        <h1 className="text-[10px] font-bold text-primary leading-tight tracking-tight">AAYAM GLOBAL SCHOOL</h1>
                        <p className="text-[7px] text-primary/80 leading-tight">Tilottama-2, Janakinagar</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-semibold text-secondary">STUDENT ID</p>
                    </div>
                </div>

                <div className="relative px-3 py-2 flex gap-3">
                    <div className="shrink-0">
                        <div className="w-[0.9in] h-[1.2in] bg-primary-foreground rounded-md overflow-hidden border-2 border-secondary shadow-md">
                            <img
                                src={student.account.profileImage?.url || "/placeholder.svg"}
                                alt={student.firstName + " " + student.lastName}
                                width={120}
                                height={160}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                            <div>
                                <p className="text-[7px] text-primary-foreground/70 uppercase tracking-wide font-medium">
                                    Student Name
                                </p>
                                <p className="text-[11px] font-bold text-primary-foreground leading-tight">{student.firstName} {student.lastName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <div>
                                    <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">ID Number</p>
                                    <p className="text-[9px] font-semibold text-secondary">{student.studentId}</p>
                                </div>
                                <div>
                                    <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">Blood Group</p>
                                    <p className="text-[9px] font-semibold text-secondary">{student.bloodGroup}</p>
                                </div>
                                <div>
                                    <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">Grade</p>
                                    <p className="text-[9px] font-semibold text-primary-foreground">{student.classRoom.parent.name || student.classRoom.name}</p>
                                </div>
                                <div>
                                    <p className="text-[6px] text-primary-foreground/70 uppercase tracking-wide">Section</p>
                                    <p className="text-[9px] font-semibold text-primary-foreground">{student.classRoom.parent.name ? student.classRoom.name : "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/20 rounded px-2 py-1 backdrop-blur-xs">
                            <p className="text-[6px] text-primary-foreground/80 uppercase tracking-wide">Valid Until</p>
                            <p className="text-[8px] font-bold text-secondary">2025-12-30</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ID Card Back */}
            <Card className="w-[3.375in] h-[2.125in] relative overflow-hidden bg-linear-to-br from-primary/5 to-secondary/10 shadow-xl">
                {/* Header */}
                <div className="bg-primary px-3 py-2 border-b-2 border-secondary">
                    <h2 className="text-[9px] font-bold text-primary-foreground text-center uppercase tracking-wide">
                        Important Information
                    </h2>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                    <div className="grid grid-cols-2">
                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">Date of Birth</p>
                            <p className="text-[9px] font-semibold text-foreground">{new Date(student.dob).toDateString()}</p>
                        </div>

                        <div>
                            <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">Address</p>
                            <p className="text-[8px] text-foreground leading-tight">{student.currentAddress}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[7px] text-foreground/70 uppercase tracking-wide font-medium mb-0.5">
                            Emergency Contact
                        </p>
                        <p className="text-[9px] font-semibold text-foreground">9800456552</p>
                    </div>


                    <div className="pt-2 border-t border-border">
                        <p className="text-[6px] text-muted-foreground italic text-center leading-relaxed">
                            This card is the property of Loomis Global School.
                            <br />
                            If found, please return to the school office.
                        </p>
                    </div>

                    {/* School contact */}
                    <div className="bg-primary/5 rounded px-2 py-1.5 border border-primary/20">
                        <p className="text-[6px] text-foreground/60 uppercase tracking-wide mb-0.5">School Contact</p>
                        <p className="text-[7px] font-medium text-foreground">Phone: +977-XXXX-XXXXXX</p>
                        <p className="text-[7px] font-medium text-foreground">Email: info@loomisglobal.edu.np</p>
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
