import { PropsWithChildren } from "react";

export default function NotAvailable({ children }: PropsWithChildren) {
    return (
        <span className="text-muted-foreground italic text-sm font-medium">
            {children ?? "N/A"}
        </span>
    )
}