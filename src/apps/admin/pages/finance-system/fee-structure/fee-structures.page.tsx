import { useGetFeeStructures } from "@/apps/admin/components/finance-system/data-access";
import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search";
import { createQueryString } from "@/utils/create-query-string";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, Plus, Trash, X } from "lucide-react";
import { useAppMutation } from "@/hooks/useAppMutation";
import { Input } from "@/components/ui/input";
import { TFeeStructure } from "@/types/finance-system/finance.types";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import FeeStructureFrom from "@/apps/admin/components/finance-system/fee-structures/fee-structure-form";
import { QueryKey } from "@/react-query/queryKeys";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { NUMBER_REGEX_STRING } from "@/CONSTANTS";

export default function FeeStructuresPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchParams] = useSearchParams();

    return (
        <ContainerLayout
            title="Fee Structures"
            description="Manage fee structures for fees of each class room"
        >
            <section className="flex justify-between gap-5 items-end">
                <ClassRoomSearchFilterInputs onlyClassRoom />

                {
                    searchParams.get("classRoomId") && (
                        <section>
                            <ResponsiveDialog
                                isOpen={isAddOpen}
                                setIsOpen={setIsAddOpen}
                                title="Add new fee structure"
                            >
                                <FeeStructureFrom classRoomId={searchParams.get('classRoomId')!} setIsOpen={setIsAddOpen} />
                            </ResponsiveDialog>
                            <Button type="button" onClick={() => setIsAddOpen(true)}>
                                <Plus />
                                Add New
                            </Button>
                        </section>
                    )
                }
            </section>
            <FeeStructuresList />
        </ContainerLayout>
    )
}

function FeeStructuresList() {
    const [searchParams] = useSearchParams();

    const { classRoomId } = useMemo(() => {
        return {
            classRoomId: searchParams.get("classRoomId"),
        }
    }, [searchParams]);

    const { data, isLoading } = useGetFeeStructures({
        queryString: createQueryString({
            classRoomId,
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            skipPagination: true,
            order: 'ASC'
        }),
        options: { enabled: !!classRoomId }
    });

    if (isLoading) return <div>Loading...</div>;
    if (!classRoomId) return <div className="h-[400px] grid place-items-center text-muted-foreground">Select class room to view fee structures</div>;

    return (
        <section>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-tableheader">
                        <TableRow>
                            <TableHead>S.N</TableHead>
                            <TableHead>Charge Head</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data?.map((feeStructure, index) => {
                            return <FeeStructureRow key={feeStructure.id} feeStructure={feeStructure} ind={index} />
                        })}
                        {
                            data?.data?.length === 0 && <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-10">No fee structures found.</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </div>
            {
                data?.meta && <section className="mt-4">
                    <DataTablePagination meta={data?.meta} />
                </section>
            }
        </section>
    )
}

const FeeStructureRow = ({ feeStructure, ind }: { feeStructure: TFeeStructure, ind: number }) => {
    const [amount, setAmount] = useState(feeStructure.amount);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { mutateAsync, isPending } = useAppMutation();
    const { mutateAsync: mutateAsyncDelete, isPending: isPendingDelete } = useAppMutation();

    const handleUpdate = async () => {
        await mutateAsync({
            method: "patch",
            endpoint: QueryKey.FEE_STRUCTURES + `/${feeStructure.id}`,
            data: {
                amount,
            },
            invalidateTags: [QueryKey.FEE_STRUCTURES],
        });
    }

    const handleDelete = async () => {
        await mutateAsyncDelete({
            method: "delete",
            endpoint: QueryKey.FEE_STRUCTURES + `/${feeStructure.id}`,
            invalidateTags: [QueryKey.FEE_STRUCTURES],
        });
    }

    return (
        <TableRow>
            <TableCell>{ind + 1}</TableCell>
            <TableCell>{feeStructure?.chargeHead?.name}</TableCell>
            <TableCell>
                <section className="flex gap-10">
                    <Input
                        type="number"
                        id={feeStructure.id}
                        value={amount}
                        pattern={NUMBER_REGEX_STRING}
                        onChange={(e) => {
                            setAmount(isNaN(Number(e.target.value)) ? feeStructure.amount : Number(e.target.value));
                        }}
                        className="max-w-[200px]"
                        min={0}
                    />
                    <section className={cn(amount === feeStructure.amount && "pointer-events-none invisible", "space-x-2")}>
                        <TooltipWrapper label="Cancel changes" contentClassName="text-xs">
                            <Button
                                type="button"
                                size={'icon'}
                                variant={'ghost'}
                                className="text-destructive hover:text-destructive hover:bg-destructive/15"
                                onClick={() => setAmount(feeStructure.amount)}
                            >
                                <X />
                            </Button>
                        </TooltipWrapper>
                        <TooltipWrapper label="Save changes" contentClassName="text-xs">
                            <Button
                                type="button"
                                size={'icon'}
                                variant={'ghost'}
                                className="text-success hover:text-success hover:bg-success/15"
                                onClick={handleUpdate}
                                disabled={amount === feeStructure.amount || isPending}
                            >
                                {
                                    isPending ? <LoaderCircle className="animate-spin" /> : <Check />
                                }
                            </Button>
                        </TooltipWrapper>
                    </section>
                </section>
            </TableCell>
            <TableCell>
                <ResponsiveAlertDialog
                    isOpen={isDeleteOpen}
                    setIsOpen={setIsDeleteOpen}
                    title="Delete Fee Structure"
                    description="Are you sure you want to delete this fee structure?"
                    action={handleDelete}
                    actionLabel="Yes, Delete"
                    isLoading={isPendingDelete}
                />
                {
                    !feeStructure.chargeHead?.isMandatory && (
                        <TooltipWrapper label="Delete" contentClassName="text-xs">
                            <Button
                                type="button"
                                size={'icon'}
                                variant={'ghost'}
                                className="text-destructive hover:text-destructive hover:bg-destructive/15"
                                onClick={() => setIsDeleteOpen(true)}
                                disabled={isPendingDelete}
                            >
                                <Trash />
                            </Button>
                        </TooltipWrapper>
                    )
                }
            </TableCell>
        </TableRow>
    )
}