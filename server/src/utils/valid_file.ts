export function checkIfImage(file: string) {
    if (file.includes("jpg") || file.includes("png") || file.includes("jpeg")) return true;
    return false;
}