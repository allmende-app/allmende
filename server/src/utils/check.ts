import { KingdomType } from "../interfaces";

export const checkValidKingdomType = (types: string[] | string) => {
    if (!Array.isArray(types)) {
        if (
            !Object.values(KingdomType).includes(
                types as unknown as KingdomType,
            )
        ) {
            return false;
        }
        return true;
    }
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (
            !Object.values(KingdomType).includes(type as unknown as KingdomType)
        )
            return false;
    }

    return true;
};
