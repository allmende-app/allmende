import { KingdomType } from "../interfaces";

export const checkValidKingdomType = (types: string[]) => {
    for (const str of types) {
        if (!Object.values(KingdomType).includes(str as unknown as KingdomType))
            return false;
    }

    return true;
};
