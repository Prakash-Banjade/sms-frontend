export function createSearchParams(params: Record<string, any>) {
    // Remove undefined values
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    return new URLSearchParams(filteredParams).toString();
}