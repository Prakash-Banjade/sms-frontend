import { ProfileAvatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useState } from 'react'
type BookInfo = {
    id: string,
    title: string,
    author: string,
    borrowDate: string,
    dueDate: string,
    status: string
    coverUrl: string
}

const [books, setBooks] = useState<BookInfo[]>([
    { id: "1", title: "To Kill a Mockingbird", author: "Harper Lee", borrowDate: "2023-05-01", dueDate: "2023-05-15", status: 'returned', coverUrl: "https://i.pravatar.cc/150?img=2" },
    { id: " 2", title: "1984", author: "George Orwell", borrowDate: "2023-05-10", dueDate: "2023-05-24", status: 'borrowed', coverUrl: "https://i.pravatar.cc/150?img=3" },
    { id: " 3", title: "The Great Gatsby", author: "F. Scott Fitzgerald", borrowDate: "2023-04-20", dueDate: "2023-05-04", status: 'overdue', coverUrl: "https://i.pravatar.cc/150?img=4" },
    { id: "4", title: "Pride and Prejudice", author: "Jane Austen", borrowDate: "2023-05-05", dueDate: "2023-05-19", status: 'borrowed', coverUrl: "https://i.pravatar.cc/150?img=5" },
    { id: " 5", title: "The Catcher in the Rye", author: "J.D. Salinger", borrowDate: "2023-04-15", dueDate: "2023-04-29", status: 'returned', coverUrl: "https://i.pravatar.cc/150?img=6" },
])
const getStatusBadge = (status: BookInfo['status']) => {
    switch (status) {
        case 'borrowed':
            return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Borrowed</Badge>
        case 'overdue':
            return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Overdue</Badge>
        case 'returned':
            return <Badge variant="outline"><CheckCircle className="mr-1 h-3 w-3" /> Returned</Badge>
    }
}

const LibraryCard = () => {
    return (
        <div>
            {
                //
            }
        </div>
    )
}

export default LibraryCard
