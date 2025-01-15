import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mic, RefreshCcw, Video } from 'lucide-react'

interface AccessBlockedWarningProps {
    onRetry: () => void
}

export default function AccessBlockedWarning({ onRetry }: AccessBlockedWarningProps) {
    return (
        <Card className="w-full max-w-lg mx-auto border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mr-2" />
                    Access Blocked
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-lg font-medium">
                    Please allow access to your microphone and camera to join the call.
                </p>
                <div className="flex justify-center space-x-4">
                    <div className="flex flex-col items-center">
                        <Mic className="w-12 h-12 text-muted-foreground" />
                        <span className="text-sm mt-2">Microphone</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Video className="w-12 h-12 text-muted-foreground" />
                        <span className="text-sm mt-2">Camera</span>
                    </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">How to allow access:</h3>
                    <ol className="text-sm text-left list-decimal list-inside space-y-1">
                        <li>Click the camera icon in your browser&apos;s address bar</li>
                        <li>Select &quot;Always allow&quot; for both microphone and camera</li>
                        <li>Refresh the page</li>
                    </ol>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="button" variant="outline" className="w-full" onClick={onRetry}>
                    <RefreshCcw />
                    Retry
                </Button>
            </CardFooter>
        </Card>
    )
}

