import { ProfileAvatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getImageUrl } from '@/lib/utils'
import { St_Teacher } from '@/types/teacher.type'
import { Book, Mail, Phone } from 'lucide-react'

type Props = {
    teachers: St_Teacher[]
}

const TeacherList = ({ teachers }: Props) => {
    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {teachers?.map((teacher, ind) => (
                <Card key={ind} className="flex flex-col h-full">
                    <CardHeader className="flex-grow">
                        <div className="flex items-center space-x-4">
                            <ProfileAvatar name={teacher.teacherFullName} src={getImageUrl(teacher.profileImageUrl, 'w=40')} className="size-10" />
                            <CardTitle className="text-lg">{teacher.teacherFullName}</CardTitle>

                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-3'>
                        <div className='flex gap-2 items-center text-muted-foreground'>
                            <Book className=" h-4 w-4" />
                            {teacher.subject}
                        </div>
                        <a
                            href={`mailto:${teacher.email}`}
                            className="text-muted-foreground hover:underline hover:text-blue-500 flex items-center"
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            {teacher.email}
                        </a>
                        <a
                            href={`tel:${teacher.email}`}
                            className="text-muted-foreground hover:underline hover:text-blue-500 flex items-center"
                        >
                            <Phone className="mr-2 h-4 w-4" />
                            {teacher.phone}
                        </a>
                    </CardContent>
                </Card>
            ))}
        </div>

    )
}

export default TeacherList
