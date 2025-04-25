import { TUpcommingExamType } from "@/apps/admin/types/examination.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { format } from "date-fns"

export default function UpcommingExamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Exams</CardTitle>
        <CardDescription>Prepare for these upcoming examinations</CardDescription>
      </CardHeader>
      <CardContent>
        <Content />
      </CardContent>
    </Card>
  )
}

function Content() {
  const { data, isLoading } = useFetchData<TUpcommingExamType>({
    endpoint: QueryKey.EXAMS + '/upcomming',
    queryKey: [QueryKey.EXAMS, 'upcomming'],
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return (
    <p className="text-muted-foreground text-sm text-center py-8">😀 Just chill, no exam scheduled!</p>
  )

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
              <TableCell className="font-medium">{sub.subject.subjectName}</TableCell>
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