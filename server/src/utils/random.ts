import { avatarURLs } from "./utils";

export function randomIndex(array: any[]) {
    return Math.floor(Math.random() * array.length);
}

export function randomAvatarURL() {
    return `${randomIndex(avatarURLs)}.jpg`;
}
