import { TUpcommingExamType } from "@/apps/admin/types/examination.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { format, isBefore } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { CircleCheckBig } from "lucide-react"


export default function UpcommingExamCard() {
  const { data, isLoading } = useFetchData<TUpcommingExamType>({
    endpoint: QueryKey.DASHBOARD + '/student/upcomming-exams',
    queryKey: [QueryKey.DASHBOARD, 'student/upcomming-exams'],
  });

  if (isLoading) return <ExamCardSkeleton />;

  const isUpcomming = data?.startingFrom ? isBefore(new Date(), data?.startingFrom) : false;
  const isRunning = data?.endsOn ? (isBefore(new Date(), data?.endsOn) && !isUpcomming) : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isUpcomming ? 'Upcomming Exam' : isRunning ? 'Running Exam' : 'No Exams'}
        </CardTitle>
        {
          isUpcomming && (
            <CardDescription>Prepare for these upcoming examinations</CardDescription>
          )
        }
        {
          isRunning && (
            <CardDescription>Study hard for these examinations</CardDescription>
          )
        }
      </CardHeader>
      <CardContent>
        <Content data={data} />
      </CardContent>
    </Card>
  )
}

function Content({ data }: { data: TUpcommingExamType | undefined }) {
  if (!data) return <p className="text-muted-foreground text-sm text-center py-8">😀 Just chill, no exam scheduled!</p>

  return (
    <>
      <h3 className="text-lg font-medium">{data.examType.name} Examination</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.examSubjects.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium flex items-center">
                {sub.subject.subjectName}
                {
                  isBefore(sub.examDate, new Date()) && (
                    <CircleCheckBig size={18} className="ml-2 text-success" />
                  )
                }
              </TableCell>
              <TableCell>{format(sub.examDate, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{sub.startTime}</TableCell>
              <TableCell>{sub.venue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}


function ExamCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <Skeleton className="h-8 w-48" />
        </CardTitle>
        <Skeleton className="h-4 w-64 mt-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-56" />

        <div className="space-y-1">
          {/* Table header row */}
          <div className="grid grid-cols-4 gap-4 py-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Separator */}
          <Skeleton className="h-px w-full" />

          {/* Table rows */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
