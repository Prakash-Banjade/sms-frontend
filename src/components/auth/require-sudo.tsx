import SudoActionConfirmPage from "@/apps/common/pages/sudo-access-confirm/sudo-access-confirm.page";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const RequireSudo = () => {
    const [isVerified, setIsVerified] = useState<boolean>(false);

    return !!isVerified ? (
        <Outlet />
    ) : (
        <SudoActionConfirmPage setIsVerified={setIsVerified} />
    );
};

export default RequireSudo;