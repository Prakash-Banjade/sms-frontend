import { CookieKey } from "@/CONSTANTS";

type CookieOptions = {
    path?: string;
    expires?: Date;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
};

// Set a cookie
export const setCookie = (
    name: CookieKey,
    value: string,
    options: CookieOptions = {}
): void => {
    const { path = "/", expires, maxAge, secure, sameSite = "Lax" } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;

    if (expires) {
        cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (maxAge) {
        cookieString += `; max-age=${maxAge}`;
    }

    if (secure) {
        cookieString += "; secure";
    }

    cookieString += `; sameSite=${sameSite}`;

    document.cookie = cookieString;
};

// Get a cookie
export const getCookie = (name: CookieKey): string | null => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === decodeURIComponent(name)) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Delete a cookie
export const deleteCookie = (name: CookieKey, path: string = "/"): void => {
    setCookie(name, "", { path, maxAge: -1 });
};
