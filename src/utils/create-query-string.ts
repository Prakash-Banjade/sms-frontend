export function createQueryString(params: Record<string, any>) {
    // Remove undefined values
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => !!value)
    );

    return new URLSearchParams(filteredParams).toString();
}