import { Outlet } from "react-router-dom"

type Props = {}

export default function PublicLayout({ }: Props) {
    return (
        <main>
            <Outlet />
        </main>
    )
}