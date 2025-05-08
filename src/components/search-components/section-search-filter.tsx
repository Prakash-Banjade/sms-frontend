import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetClassRoomsOptions } from "@/apps/admin/components/class-rooms/actions";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";

export function SectionSearchFilters(props: { classRoomId?: string }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const classRoomId = props.classRoomId ?? searchParams.get('classRoomId');

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
        options: { enabled: !!classRoomId }
    });

    return (
        <section className="space-y-2">
            <Label>Select section</Label>
            <Select
                value={searchParams.get('sectionId') ?? ''}
                onValueChange={val => {
                    (!!val && val !== 'all') ? searchParams.set('sectionId', val) : searchParams.delete('sectionId');
                    setSearchParams(searchParams);
                }}
                disabled={!classRoomId || isLoading}
            >
                <SelectTrigger className="min-w-[200px]">
                    <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value={'all'} className="text-xs text-muted-foreground">Select Section</SelectItem>
                        {
                            data?.find((classRoom) => classRoom.id === classRoomId)?.children?.map((section) => (
                                <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </section>
    )
}