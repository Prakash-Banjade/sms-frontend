import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Library_StudentTransactionInfo from "../../components/library/issue-and-return/student/student-transaction-info"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useSearchParams } from "react-router-dom"
import Library_TeacherTransactionInfo from "../../components/library/issue-and-return/teacher/teacher-transaction-info"

enum MemberType {
  Student = 'student',
  Teacher = 'teacher',
}

const formSchema = z.object({
  memberType: z.nativeEnum(MemberType, { message: "Member Type is required" }),
  memberId: z.string({ required_error: "Member ID is required" }).min(1, { message: "Member ID is required" }),
})

export default function BookIssuesAndReturnPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: searchParams.get('teacherId') || searchParams.get('studentId') || '',
      memberType: searchParams.get('memberType') as MemberType || undefined
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    searchParams.delete("teacherId");
    searchParams.delete("studentId");
    searchParams.set('memberType', values.memberType);
    searchParams.set(values.memberType === MemberType.Teacher ? "teacherId" : "studentId", values.memberId.trim());

    setSearchParams(searchParams);
  }

  return (
    <div className="container mx-auto @container">

      <Card>
        <CardHeader className="pb-0">
          <Label htmlFor="memberId">Search for a library member</Label>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          <Form {...form}>
            <form className="flex" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="memberType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[150px] rounded-r-none border-r-0 pl-4">
                          <SelectValue placeholder="Member Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MemberType.Student}>Student</SelectItem>
                        <SelectItem value={MemberType.Teacher}>Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Input
                placeholder="Enter Member ID"
                className="w-80 rounded-none"
                {...form.register('memberId')}
              />
              <Button type="submit" className="rounded-l-none">Search</Button>
            </form>
          </Form>

          <p className="text-sm text-destructive mt-2">
            {
              Object.entries(form.formState.errors).map(([key, value]) => (
                <span key={key}>{value.message}. </span>
              ))
            }
          </p>
        </CardContent>
      </Card>

      {
        form.watch('memberType') === MemberType.Student ? (
          <Library_StudentTransactionInfo />
        ) : form.watch("memberType") === MemberType.Teacher ? (
          <Library_TeacherTransactionInfo />
        ) : <p className="h-[400px] grid place-items-center text-muted-foreground">Please select a member type</p>
      }
    </div>
  )
}