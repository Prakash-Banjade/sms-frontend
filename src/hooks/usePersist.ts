import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem("persist") ?? 'false') || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return {
        persist: persist || !!window.opener, // needs to persist if new window is opened by the current one, (used in stream video call)
        setPersist
    }
}
export default usePersist;