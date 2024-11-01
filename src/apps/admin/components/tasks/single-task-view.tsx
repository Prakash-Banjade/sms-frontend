import { CalendarIcon, FileIcon, GraduationCapIcon, UsersIcon, DownloadIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Attachment {
    name: string
    url: string
}

interface Submission {
    studentName: string
    studentId: string
    attachments: Attachment[]
    content: string
    submissionDate: Date
    evaluated: boolean
}

interface AssignmentProps {
    title?: string
    description?: string
    classRoom?: string
    sections?: string[]
    submissionDate?: Date
    createdDate?: Date
    attachments?: Attachment[]
    submissions?: Submission[]
}

export default function SingleTaskView({
    title = "Math Homework: Algebra Basics",
    description = "Complete exercises 1-10 from Chapter 3 of the textbook. Show all your work and explain your reasoning for each problem.",
    classRoom = "Mathematics",
    sections = ["Section A", "Section B"],
    submissionDate = new Date("2023-11-15"),
    createdDate = new Date("2023-11-01"),
    attachments = [
        { name: "Chapter_3_Exercises.pdf", url: "#" },
        { name: "Additional_Resources.docx", url: "#" }
    ],
    submissions = [
        {
            studentName: "Alice Johnson",
            studentId: "S12345",
            attachments: [{ name: "Alice_Homework.pdf", url: "#" }],
            content: "Completed all exercises as requested.",
            submissionDate: new Date("2023-11-14"),
            evaluated: true
        },
        {
            studentName: "Bob Smith",
            studentId: "S67890",
            attachments: [{ name: "Bob_Homework.pdf", url: "#" }],
            content: "Finished exercises 1-8, need clarification on 9-10.",
            submissionDate: new Date("2023-11-15"),
            evaluated: false
        }
    ]
}: AssignmentProps) {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground mt-2">{description}</p>
                </div>
                <Button>Edit Assignment</Button>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <GraduationCapIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Class:</span> {classRoom}
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Sections:</span>
                            <div className="flex gap-2">
                                {sections.map((section) => (
                                    <Badge key={section} variant="secondary">
                                        {section}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Submission Date:</span>
                            {format(submissionDate, "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Created Date:</span>
                            {format(createdDate, "MMMM d, yyyy")}
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2">Attachments:</h3>
                            <ul className="space-y-2">
                                {attachments.map((attachment, index) => (
                                    <li key={index}>
                                        <Button variant="link" className="h-auto p-0 text-blue-500 hover:text-blue-700">
                                            <FileIcon className="h-4 w-4 mr-2" />
                                            {attachment.name}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Submission Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <StatItem label="Total Submissions" value={submissions.length} />
                            <StatItem label="Evaluated" value={submissions.filter(s => s.evaluated).length} />
                            <StatItem label="Not Evaluated" value={submissions.filter(s => !s.evaluated).length} />
                            <StatItem label="Before Deadline" value={submissions.filter(s => s.submissionDate <= submissionDate).length} />
                            <StatItem label="Overdue" value={submissions.filter(s => s.submissionDate > submissionDate).length} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>View and manage student submissions for this assignment</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead>Attachments</TableHead>
                                    <TableHead>Evaluated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{submission.studentName}</TableCell>
                                        <TableCell>{submission.studentId}</TableCell>
                                        <TableCell>{format(submission.submissionDate, "MMM d, yyyy")}</TableCell>
                                        <TableCell>{submission.content}</TableCell>
                                        <TableCell>
                                            {submission.attachments.map((attachment, attachIndex) => (
                                                <Button key={attachIndex} variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <DownloadIcon className="h-4 w-4" />
                                                    <span className="sr-only">Download {attachment.name}</span>
                                                </Button>
                                            ))}
                                        </TableCell>
                                        <TableCell>{submission.evaluated ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground text-center">{label}</p>
        </div>
    );
}