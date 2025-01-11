import { useParams } from "react-router-dom"

export default function RunningLiveClassPage() {
    const { id } = useParams();

    return (
        <div>{id}</div>
    )
}