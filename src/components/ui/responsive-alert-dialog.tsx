import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoaderCircle } from "lucide-react";
import { buttonVariants } from "./button";

export function ResponsiveAlertDialog({
    isOpen,
    setIsOpen,
    title,
    description,
    className,
    action,
    actionLabel = "Sure",
    isLoading = false,
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    description?: string;
    className?: string;
    action: Function;
    actionLabel?: string;
    isLoading?: boolean;
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className={className}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {
                        description && (
                            <AlertDialogDescription>{description}</AlertDialogDescription>
                        )
                    }
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => action()}>
                        {
                            isLoading
                                ? <LoaderCircle className="h-4 w-4 animate-spin" />
                                : actionLabel
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
