import ContainerLayout from "@/components/page-layouts/container-layout"
import { useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import DormitoryRoomForm from "../../components/dormitory/dormitory-room.form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DormitoryRoomsList from "../../components/dormitory/dormitory-room-list";

export default function DormitoryPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ContainerLayout
            title="Dormitory Rooms"
            description="All the dormitory rooms in you school system."
            actionTrigger={
                <Button className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
                    <Plus />
                    Add New
                </Button>
            }
        >
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Edit class"
                className="w-[97%] max-w-[600px]"
            >
                <DormitoryRoomForm setIsOpen={setIsOpen} />
            </ResponsiveDialog>

            <DormitoryRoomsList />
        </ContainerLayout>
    )
}