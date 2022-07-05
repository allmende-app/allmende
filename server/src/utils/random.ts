import { avatarURLs } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function randomIndex(array: any[]) {
    return Math.floor(Math.random() * array.length);
}

export function randomAvatarURL() {
    return `${randomIndex(avatarURLs)}.jpg`;
}
