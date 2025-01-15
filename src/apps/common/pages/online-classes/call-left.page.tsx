import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoOff, VideoIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from "@/contexts/auth-provider";
import useLoadRecordings from "@/hooks/useLoadRecordings";
import useLoadCall from "@/hooks/useLoadCall";
import { Call } from "@stream-io/video-react-sdk";

export default function CallLeftPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { call } = useLoadCall(id!);

    const onRejoin = () => {
        navigate(`/${payload?.role}/live-classes/live/${id}`, { replace: true });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto py-10 border-none">
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
                <section className="space-y-2">
                    <Button onClick={onRejoin} size="lg" className="w-full">
                        <VideoIcon className="mr-2 h-5 w-5" /> Rejoin Call
                    </Button>
                    <Button variant={'ghost'} size="lg" className="w-full" onClick={() => navigate(`/${payload?.role}/live-classes`, { replace: true })}>
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Go Back
                    </Button>
                </section>

                {
                    call && <CallRecordingList call={call} />
                }
            </CardFooter>
        </Card>
    )
}

export function CallRecordingList({ call }: { call: Call }) {
    const { recordings, recordingsLoading } = useLoadRecordings(call);

    if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;

    return (
        <div className="space-y-3 text-center mt-4">
            <h2 className="text-xl font-bold mb-2">Recordings</h2>

            {
                recordings.length > 0 ? (
                    <ul className="list-inside list-disc">
                        {recordings
                            .sort((a, b) => b.end_time.localeCompare(a.end_time))
                            .map((recording) => (
                                <li key={recording.url}>
                                    <a
                                        href={recording.url}
                                        target="_blank"
                                        className="hover:underline"
                                    >
                                        {new Date(recording.end_time).toLocaleString()}
                                    </a>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="font-medium">No recordings for this class.</p>
                )
            }

            <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> It can take up to 1 minute before new recordings show up.
                <br />
                You can refresh the page to see if new recordings are available.
                <br />
                Recordings will last up to 2 weeks.
            </p>
        </div>
    )
}