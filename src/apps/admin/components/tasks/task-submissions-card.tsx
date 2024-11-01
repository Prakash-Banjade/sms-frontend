import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useGetTaskSubmissions } from "./action";
import { Link } from "react-router-dom";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { createQueryString } from "@/utils/create-query-string";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

type Props = {
  taskId: string;
}

export default function TaskSubmissionsCard({ taskId }: Props) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
        <CardDescription>View and manage student submissions for this assignment</CardDescription>
      </CardHeader>
      <TaskSubmissionsTable taskId={taskId} />
    </Card>
  )
}

function TaskSubmissionsTable({ taskId }: Props) {
  const { searchParams } = useCustomSearchParams();

  const { data: submissions, isLoading } = useGetTaskSubmissions({
    queryString: createQueryString({
      taskId,
      page: searchParams.get('page'),
      take: searchParams.get('take'),
    }),
  });

  if (isLoading) return <div>Loading...</div>;

  if (!submissions) return <div>No submissions found</div>;

  return (
    <CardContent>
      {
        !!submissions?.data?.length
          ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.N</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Attachments</TableHead>
                    <TableHead>Evaluated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.data?.map((submission, index) => (
                    <TableRow key={submission.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{submission.student.firstName} {submission.student.lastName}</TableCell>
                      <TableCell>{submission.student.studentId}</TableCell>
                      <TableCell>{format(submission.createdAt, "MMM d, yyyy")}</TableCell>
                      <TableCell className="max-w-[40ch]">{submission.content}</TableCell>
                      <TableCell>
                        {submission.attachments.map((attachment, ind) => (
                          <Link to={attachment.url} key={ind} className="text-blue-500 hover:text-blue-600 hover:underline">
                            <span>{attachment.originalName.slice(0, 20)}</span>
                          </Link>
                        ))}
                      </TableCell>
                      <TableCell>{submission.evaluation?.id ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <DataTablePagination meta={submissions?.meta} />
            </>
          ) : (
            <div>No submissions yet!</div>
          )
      }
    </CardContent>
  )
}