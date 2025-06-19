import { ThemeToggleBtn } from '@/components/theme-toggle'
import { thisSchool } from '@/CONSTANTS'
import { School } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthSideView() {
    return (
        <>
            <div className="absolute right-4 top-4 md:right-8 md:top-8">
                <ThemeToggleBtn />
            </div>
            <Link
                to="/auth/login"
                className="absolute left-4 top-4 md:left-8 md:top-8 z-20 flex items-center text-lg font-medium text-primary capitalize"
            >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mr-2">
                    <School className="size-5" />
                </div>
                {thisSchool.name}
            </Link>
            <div
                className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
                style={{
                    backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url('/auth-bg.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                {/* <div className="absolute inset-0 bg-zinc-900" /> */}
                <div
                    className="relative z-20 mt-auto"
                >
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