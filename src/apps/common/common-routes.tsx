import { Navigate, Route, Routes } from "react-router-dom"
import AccountPage from "./pages/account/account.page"
import RequireSudo from "@/components/auth/require-sudo"
import NewPassKeyPage from "./components/passkey/new-passkey-page"
import { Role } from "@/types/global.type"
import RequireAuth from "@/components/auth/require-auth"

export const CommonRoutes = () => {
    return (
        <>
            <Route path="account" element={<AccountPage />} />
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