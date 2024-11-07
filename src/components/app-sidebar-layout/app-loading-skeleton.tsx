import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Menu, Bell, ChevronDown } from "lucide-react"

export default function AppLoadingSkeleton() {
    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <div className="hidden w-72 flex-col border-r bg-background p-4 md:flex">
                {/* Logo and App Name */}
                <div className="flex items-center gap-2 pb-6">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Navigation Items */}
                <div className="space-y-6">
                    {/* Dashboard */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-4" />
                            <Skeleton className="h-6 flex-1" />
                        </div>
                    </div>

                    {/* Academic Administration */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <div className="space-y-1 pl-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-3" />
                                    <Skeleton className="h-6 w-[80%]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Student Administration */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <div className="space-y-1 pl-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-3" />
                                    <Skeleton className="h-6 w-[80%]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional sections */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <div className="space-y-1 pl-2">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-3" />
                                        <Skeleton className="h-6 w-[80%]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b px-4">
                    {/* Left section */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Skeleton className="size-8" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="size-10 rounded-2" />
                        </div>
                    </div>
                </header>

                {/* Placeholder for main content */}
                <main className="p-4">
                    <Skeleton className="h-[calc(100vh-5rem)] w-full rounded-lg" />
                </main>
            </div>
        </div>
    )
}