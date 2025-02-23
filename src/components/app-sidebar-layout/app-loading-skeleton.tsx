import { Loader2 } from "lucide-react"

export default function AppLoadingSkeleton() {
    return (
        <div className="flex items-center justify-center p-4 mt-6">
            <Loader2 className="animate-spin" />
        </div>
    )
}