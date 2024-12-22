import { useGetBranchOptions } from "@/apps/super_admin/data-access/branches-data-access"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useEffect } from "react";
import { Label } from "../ui/label";

export default function BranchSearchFilter() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const { data } = useGetBranchOptions({});

    useEffect(() => {
        if (data?.length) {
            const branchId = searchParams.get('branchId');

            if (branchId) {
                const isValid = data.some(b => b.value === branchId);

                if (!isValid) {
                    setSearchParams('branchId', undefined);
                }
            }
        }
    }, [data]);

    return data?.length ? (
        <div className="space-y-2">
            <Label>Branch</Label>
            <Select onValueChange={val => setSearchParams('branchId', val === 'reset' ? undefined : val)} value={searchParams.get('branchId') ?? ''}>
                <SelectTrigger className="min-w-[200px]">
                    <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="reset" className="text-xs text-muted-foreground">Select a branch</SelectItem>
                        {data?.map(branch => (
                            <SelectItem key={branch.value} value={branch.value}>{branch.label}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    ) : null;
}