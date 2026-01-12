import { Navigate, Route, Routes } from "react-router-dom"
import { Role } from "@/types/global.type"
import { lazy } from "react"
const RequireSudo = lazy(() => import("@/components/auth/require-sudo"))
const RequireAuth = lazy(() => import("@/components/auth/require-auth"))
const NewPassKeyPage = lazy(() => import("./components/passkey/new-passkey-page"))
const SettingsPage = lazy(() => import("./pages/settings/settings.page"))
const StreamClientProvider = lazy(() => import("../teacher/layout/stream-client-provider"))
const LiveOnlineClassPageWrapper = lazy(() => import("./pages/online-classes/live-online-class-page"))
const CallLeftPage = lazy(() => import("./pages/online-classes/call-left.page"))
const ChatLayout = lazy(() => import("../student/pages/chat/chat.layout"))
const ChatPage = lazy(() => import("../student/pages/chat/chat.page"))
const SingleChatPage = lazy(() => import("../student/pages/chat/single-chat.page"))

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

export const OnlineClassesRoutes = () => {
    return (
        <>
            <Route path="live-classes" element={<StreamClientProvider />}>
                <Route path="live">
                    <Route index element={<Navigate to="live-classes" />} />
                    <Route path=":id">
                        <Route index element={<LiveOnlineClassPageWrapper />} />
                        <Route path='left' element={<CallLeftPage />} />
                    </Route>
                </Route>
            </Route>
        </>
    )
}

export const ChatRoutes = () => {
    return (
        <>
            <Route path="chat" element={<ChatLayout />}>
                <Route index element={<ChatPage />} />
                <Route path=":id" element={<SingleChatPage />} />
            </Route>
        </>
    )
}