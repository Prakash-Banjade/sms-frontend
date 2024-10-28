import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeachersAttendanceList from "../../components/teachers/attendance-list";
import StaffsAttendanceList from "../../components/staffs/attendance-list";

export default function EmployeeAttendancePage() {

    return (
        <ContainerLayout title="Employee Attendance">
            <Tabs defaultValue="teachers" className="w-full">
                <TabsList>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="non-teachers">Non-teachers</TabsTrigger>
                </TabsList>
                <TabsContent value="teachers"><TeachersAttendanceList /></TabsContent>
                <TabsContent value="non-teachers"><StaffsAttendanceList /></TabsContent>
            </Tabs>
        </ContainerLayout>
    )
}