import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoOff, VideoIcon, ArrowLeft } from 'lucide-react'
import { useAuth } from "@/contexts/auth-provider";

export default function CallLeftPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { payload } = useAuth();

    const onRejoin = () => {
        navigate(`/${payload?.role}/live-classes/live/${id}`, { replace: true });
    }

    return (
        <Card className="w-full max-w-md mx-auto py-10 border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">You left the call</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="text-6xl text-destructive mb-4">
                    <VideoOff className="inline-block w-16 h-16" />
                </div>
                <p className="text-lg text-muted-foreground">
                    Your connection to the call has ended.
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button onClick={onRejoin} size="lg" className="w-full">
                    <VideoIcon className="mr-2 h-5 w-5" /> Rejoin Call
                </Button>
                <Button variant={'ghost'} size="lg" className="w-full" onClick={() => navigate(`/${payload?.role}/live-classes`)}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Go Back
                </Button>
            </CardFooter>
        </Card>
    )
}