import { Navigate, Route, Routes } from "react-router-dom"
import RequireSudo from "@/components/auth/require-sudo"
import NewPassKeyPage from "./components/passkey/new-passkey-page"
import { Role } from "@/types/global.type"
import RequireAuth from "@/components/auth/require-auth"
import SettingsPage from "./pages/settings/settings.page"

export const CommonRoutes = () => {
    return (
        <>
            <Route path="settings" element={<SettingsPage />} />
        </>
    )
}

export const UserRoutes = () => {
    return (
        <Routes>
            <Route element={<RequireAuth authorizedRoles={Object.values(Role)} />}>
                <Route element={<RequireSudo />}>
                    <Route path="passkey">
                        <Route index element={<Navigate to="new" />} />
                        <Route path="new" element={<NewPassKeyPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}