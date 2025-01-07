import { ThemeToggleBtn } from '@/components/theme-toggle'
import { School } from 'lucide-react'

export default function AuthSideView() {
    return (
        <>
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <ThemeToggleBtn />
            </div>
            <div className="absolute left-4 top-4 md:left-8 md:top-8 z-20 flex items-center text-lg font-medium">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-2">
                    <School className="size-5" />
                </div>
                ABHYAM ACADEMY
            </div>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Efficient school management software streamlines operations, empowers educators, and fosters a connected learning environment, allowing schools to focus more on education and less on administration.&rdquo;
                        </p>
                        <footer className="text-sm">Made by Abhyam Group</footer>
                    </blockquote>
                </div>
            </div>
        </>
    )
}