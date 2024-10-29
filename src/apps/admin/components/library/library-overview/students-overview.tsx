import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator";

type Props = {
    totalStudents: number;
    issuedStudents: number;
    topBooks: {
        bookId: string,
        bookName: string,
        transactionCount: string
    }[]
}

export default function Library_StudentsOverview({
    totalStudents,
    issuedStudents,
    topBooks,
}: Props) {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>Quick stats on student activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span>Total Students:</span>
                            <span className="font-bold">{totalStudents}</span>
                        </div>
                        <Progress value={(issuedStudents / totalStudents) * 100} />
                        <p className="text-sm text-muted-foreground mt-1">
                            {issuedStudents} students with issued books
                        </p>
                    </div>
                    {
                        topBooks.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="flex justify-between gap-2">
                                        <span>
                                            Most Active Course
                                        </span>
                                        <span>
                                            Transactions
                                        </span>
                                    </p>
                                    <ul className="flex flex-col gap-1 mt-3">
                                        {
                                            topBooks.map((book, index) => (
                                                <li key={index} className="font-semibold flex items-center gap-2 justify-between">
                                                    <span>{book.bookName}</span>
                                                    <span className="">{book.transactionCount}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    )
}