import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CreateLiveClassForm from '../components/live-classes/create-live-class-form/create-live-class-form'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export default function LiveClassesPage() {

    return (
        <ContainerLayout
            title="Live Classes"
            actionTrigger={<CreateLiveClassDialog />}
        >

        </ContainerLayout>
    )
}

function CreateLiveClassDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    <Plus /> Create Live Class
                </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[800px] w-[97%]">
                <DialogHeader>
                    <DialogTitle>Create Live Class</DialogTitle>
                    <DialogDescription>
                        Create a new live class by selecting your assigned class with subject and final details.
                    </DialogDescription>
                </DialogHeader>
                <CreateLiveClassForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>

    )
}