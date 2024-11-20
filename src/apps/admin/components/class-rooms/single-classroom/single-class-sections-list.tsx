import TableHeadings from "@/components/data-table/table-headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { useGetClasses } from "../actions";
import { createQueryString } from "@/utils/create-query-string";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import ClassSectionForm from "../class-room-section.form";
import { MoreHorizontal, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuButtonItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EClassType } from "@/types/global.type";
import { TClass } from "@/types/class.type";

type Props = {
    classRoomId: string;
}

export default function SingleClassSectionsList({ classRoomId }: Props) {
    const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);

    const { data, isLoading } = useGetClasses({
        queryString: createQueryString({
            parentClassId: classRoomId,
            classType: EClassType.SECTION,
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return null;

    return (
        <Card >
            <CardHeader>
                <section className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Sections List</CardTitle>

                    <ResponsiveDialog
                        isOpen={isSectionFormOpen}
                        setIsOpen={setIsSectionFormOpen}
                        title="Add Section"
                    >
                        <ClassSectionForm
                            parentClassId={classRoomId}
                            setIsOpen={setIsSectionFormOpen}
                        />
                    </ResponsiveDialog>

                    <Button variant={'outline'} size={'sm'} onClick={() => setIsSectionFormOpen(true)}>
                        <Plus />
                        Create New
                    </Button>
                </section>
            </CardHeader>
            <CardContent>
                {data?.data?.length ? <Table>
                    <TableHeader>
                        <TableHeadings headings={['Section Name', 'Total Students', 'Total Male Students', 'Total Female Students', 'Class Teacher', 'Location']} />
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((section) => {
                            return (
                                <TableRow key={section.id}>
                                    <TableCell>{section.name}</TableCell>
                                    <TableCell>{section.totalStudentsCount}</TableCell>
                                    <TableCell>{section.totalMaleStudentsCount}</TableCell>
                                    <TableCell>{section.totalFemaleStudentsCount}</TableCell>
                                    <TableCell>{section.classTeacherName || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                    <TableCell>{section.location || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                    <TableCell>
                                        <TableActionCell section={section} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table> : <p className="text-muted-foreground">No sections found.</p>}
            </CardContent>
        </Card>
    )
}

function TableActionCell({ section }: { section: TClass }) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                title="Edit class"
            >
                <ClassSectionForm
                    classRoomId={section.id}
                    setIsOpen={setIsEditOpen}
                    defaultValues={{
                        name: section.name,
                        monthlyFee: section.monthlyFee,
                        admissionFee: section.admissionFee,
                        location: section.location,
                        classTeacherId: section.classTeacherId,
                    }}
                    selectedClassTeacherOption={
                        (section.classTeacherId && section.classTeacherName)
                            ? { value: section.classTeacherId, label: section.classTeacherName }
                            : undefined
                    }
                />
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
                    <DropdownMenuButtonItem onClick={() => setIsEditOpen(true)}>
                        <span>Edit section</span>
                    </DropdownMenuButtonItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}