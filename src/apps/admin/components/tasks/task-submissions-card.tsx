import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useGetTaskSubmissions } from "./action";
import { Link } from "react-router-dom";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { createQueryString } from "@/utils/create-query-string";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import SearchInput from "@/components/search-components/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { TaskSubmission, TSingleTask } from "../../types/task.type";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import TaskEvaluationForm from "./task-evaluation-form";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";

type Props = {
  task: TSingleTask;
}

export default function TaskSubmissionsCard({ task }: Props) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
        <CardDescription>View and manage student submissions for this assignment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubmissionsFilter />
        <TaskSubmissionsTable task={task} />
      </CardContent>
    </Card>
  )
}

function TaskSubmissionsTable({ task }: Props) {
  const { searchParams } = useCustomSearchParams();
  const { payload } = useAuth();

  const { data: submissions, isLoading } = useGetTaskSubmissions({
    queryString: createQueryString({
      taskId: task.id,
      search: searchParams.get("search"),
      evaluated: searchParams.get('evaluated') || "false",
      page: searchParams.get('page'),
      take: searchParams.get('take'),
    }),
  });

  if (isLoading) return <div className="p-6 pb-10 text-center text-muted-foreground">Loading...</div>;

  if (!submissions || !submissions.data?.length) return <div className="p-6 pb-10 text-center text-muted-foreground">No submissions yet!</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.N</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Attachments</TableHead>
            {
              payload?.role === Role.TEACHER && (
                <TableHead></TableHead>
              )
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions?.data?.map((submission, index) => (
            <TableRow key={submission.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{submission.student.firstName} {submission.student.lastName}</TableCell>
              <TableCell>{submission.student.studentId}</TableCell>
              <TableCell>{format(submission.createdAt, "MMM d, yyyy")}</TableCell>
              <TableCell className="max-w-[40ch]">{submission.note}</TableCell>
              <TableCell>
                <ul className="flex flex-col gap-1">
                  {submission.attachments.map((attachment, ind) => (
                    <li key={ind}>
                      <Link to={attachment.url} className="text-blue-500 hover:text-blue-600 hover:underline">
                        <span>{attachment.originalName.slice(0, 20)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </TableCell>
              {
                payload?.role === Role.TEACHER && (
                  <TableCell>
                    <TaskSubmissionsActions submission={submission} task={task} />
                  </TableCell>
                )
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataTablePagination meta={submissions?.meta} />
    </>
  )
}

function TaskSubmissionsActions({ submission, task }: { submission: TaskSubmission } & Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={submission.evaluation?.id ? "Re-evaluate" : "Evaluate the submission"}
      >
        {
          submission.evaluation?.id ? (
            <TaskEvaluationForm taskSubmissionId={submission.id} defaultValues={submission.evaluation} taskMarks={task.marks} setIsOpen={setIsOpen} />
          ) : (
            <TaskEvaluationForm taskSubmissionId={submission.id} taskMarks={task.marks} setIsOpen={setIsOpen} />
          )
        }
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuButtonItem onClick={() => setIsOpen(true)}>
            {
              submission.evaluation?.id ? (
                <span>Re-evaluate</span>
              ) : (
                <span>Evaluate</span>
              )
            }
          </DropdownMenuButtonItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}

function SubmissionsFilter() {
  const { searchParams, setSearchParams } = useCustomSearchParams();

  return (
    <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
      <section>
        <SearchInput placeholder="Search by student ID" />
      </section>

      <Select
        onValueChange={val => setSearchParams("evaluated", val)}
        value={searchParams.get("evaluated") || "false"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="false">Not Evaluated</SelectItem>
          <SelectItem value="true">Evaluated</SelectItem>
        </SelectContent>
      </Select>
    </section>
  )
}