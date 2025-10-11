import { cn } from "@/lib/utils"

interface InfoFieldProps {
    label: string
    value: string | number | boolean | null | undefined
    className?: string
}

export function InfoField({ label, value, className }: InfoFieldProps) {
    const displayValue =
        value === null || value === undefined ? "N/A" : typeof value === "boolean" ? (value ? "Yes" : "No") : value

    return (
        <div className={cn("space-y-1", className)}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-foreground">{displayValue}</dd>
        </div>
    )
}
