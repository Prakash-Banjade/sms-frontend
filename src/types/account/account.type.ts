export type TWebAuthnCredential = {
    id: string,
    createdAt: string,
    name: string,
    lastUsed: string | null,
}

export type TLoginDevice = {
    ua: string,
    deviceId: string,
    firstLogin: string,
    lastActivityRecord: string,
    current: boolean,
    signedIn: boolean,
}