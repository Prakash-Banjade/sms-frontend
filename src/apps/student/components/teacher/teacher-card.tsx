import { ProfileAvatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getImageUrl } from '@/lib/utils'
import { Teacher } from '@/types/teacher.type'


import { Mail, Phone } from 'lucide-react'

type Props = {
    teachers: Teacher[]
}

const TeacherList = ({ teachers }: Props) => {
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers?.map((teacher) => (
                <Card key={teacher.id} className="flex flex-col h-full">
                    <CardHeader className="flex-grow">
                        <div className="flex items-center space-x-4">
                            <ProfileAvatar name={teacher.teacherFullName} src={getImageUrl(teacher.profileImage?.url, 'w=40')} className="size-10" />
                            <div>
                                <CardTitle className="text-lg">{teacher.teacherFullName}</CardTitle>
                                <Badge variant="info" className="mt-1 capitalize">
                                    {/* {teacher.} */}
                                    math
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-3'>
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
