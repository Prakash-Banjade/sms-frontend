import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4">
            <div className="flex flex-col items-center text-center max-w-md">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">Page not found</h2>
                <p className="text-muted-foreground mb-8">
                    Sorry, we couldn't find the page you're looking for. The page might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>
                <Button asChild>
                    <Link to="/">Go back home</Link>
                </Button>
            </div>
        </div>
    )
}