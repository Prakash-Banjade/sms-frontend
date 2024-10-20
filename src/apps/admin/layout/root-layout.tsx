import { Outlet } from "react-router-dom";

export default function AdminRootLayout() {
    return (
        <div>
            Admin Root Layout
            <Outlet />
        </div>
    );
}