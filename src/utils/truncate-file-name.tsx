export function truncateFilename(filename: string, maxLength: number) {
    const lastDotIndex = filename.lastIndexOf('.');

    // Handle case with no extension
    if (lastDotIndex === -1) {
        return filename.length > maxLength ? `${filename.slice(0, maxLength)}...` : filename;
    }

    const name = filename.slice(0, lastDotIndex);
    const extension = filename.slice(lastDotIndex);

    // If filename exceeds max length, truncate the name part
    return (name.length > maxLength - extension.length - 3)
        ? `${name.slice(0, maxLength - extension.length - 3)}...${extension}`
        : filename;
}
