import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"


export default function LeaveRequestConfirmation() {
    return (
        <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Leave Request Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground mb-4">
                        Your leave request has been successfully submitted. You will be notified once it has been approved.
                    </p>
                    <div className="bg-muted-foreground/10 border-l-4    p-4 mb-4">
                        <p className="text-sm text-muted-foreground">
                            <strong>Next steps:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm  space-y-2 text-muted-foreground mt-2">
                            <li>Your request will be reviewed by the administration</li>
                            <li>You'll receive a notification about the approval status</li>
                            <li>Check your student portal for updates</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/dashboard">
                        <Button variant={'outline'}>
                            Return to Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}