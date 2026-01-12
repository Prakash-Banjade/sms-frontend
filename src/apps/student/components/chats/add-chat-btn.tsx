import { useGetTeachers } from '@/apps/admin/components/teachers/actions';
import { St_TeacherResponse } from '@/apps/admin/types/teacher.type';
import { Button } from '@/components/ui/button'
import { createQueryString } from '@/utils/create-query-string';
import { Loader2, Plus } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileAvatar } from '@/components/ui/avatar';
import { getImageUrl } from '@/lib/utils';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import { useState } from 'react';

export default function AddChatBtn() {
    const [open, setOpen] = useState(false);
    const [pendingTeacherId, setPendingTeacherId] = useState<string | null>(null);

    const { data, isLoading } = useGetTeachers<St_TeacherResponse>({
        queryString: createQueryString({
            skipPagination: 'true',
        }),
    });

    const { mutateAsync, isPending } = useAppMutation();

    const onSubmit = async (teacherId: string) => {
        setPendingTeacherId(teacherId);
        await mutateAsync({
            method: 'post',
            endpoint: QueryKey.CONVERSATIONS,
            data: {
                teacherId,
            },
            invalidateTags: [QueryKey.CONVERSATIONS],
            onSuccess: () => {
                setOpen(false);
                setPendingTeacherId(null);
            },
        });
    }



    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    variant={'outline'}
                    size={'icon'}
                    disabled={isLoading || isPending}
                >
                    <Plus />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Select Teacher</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    data?.data?.map((teacher, ind) => {
                        return (
                            <button
                                key={ind}
                                type="button"
                                className='w-full p-2 flex items-center gap-4 cursor-pointer hover:bg-accent rounded-md'
                                onClick={() => onSubmit(teacher.teacherId)}
                                disabled={isPending}
                            >
                                {
                                    (isPending && pendingTeacherId === teacher.teacherId) ? (
                                        <Loader2 className="animate-spin size-8" />
                                    ) : (
                                        <ProfileAvatar
                                            name={teacher.teacherFullName}
                                            src={getImageUrl(teacher.profileImageUrl, 'w=32')}
                                            className='size-8'
                                        />
                                    )
                                }
                                <span>{teacher.teacherFullName}</span>
                            </button>
                        )
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}