import AuthSideView from "@/apps/public/components/auth-side-view";
import { Button } from "../ui/button";
import usePersist from "@/hooks/usePersist";

export default function LoginExpireView() {
    const { setPersist } = usePersist();

    const handleLoginAgain = () => {
        setPersist(false);
        window.location.reload();
    }

    return (
        <div className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-w-full">
            <AuthSideView />
            <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-2">Oops!</h1>
                </div>
                <div className="w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Your session has expired</h2>
                        <p className="text-muted-foreground mb-8">
                            For your security, we've ended your session due to inactivity. Please log in again to continue.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Button className="w-full text-lg py-6" type="button" onClick={handleLoginAgain}>
                            Log In Again
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}