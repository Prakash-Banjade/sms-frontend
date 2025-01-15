import ClientProvider from '@/contexts/client-provider'
import { Outlet } from 'react-router-dom'

export default function StreamClientProvider() {
    return (
        <ClientProvider> {/* For stream video client */}
            <Outlet />
        </ClientProvider>
    )
}