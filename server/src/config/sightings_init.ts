import { Sighting } from "../models";
import { reverseLocationSearch } from "../utils";

export const initializeLocations = async () => {
    const sightings = await Sighting.find({});
    const steps = sightings.filter(
        (s) => s.lat && s.lng && !s.location && !s.subname,
    );
    for (let i = 0; i < steps.length; i += 20) {
        const elements = steps.slice(i, i + 20);
        for (let j = 0; j < elements.length; j += 5) {
            const locations = await Promise.all(
                elements
                    .slice(j, j + 5)
                    .map((e) =>
                        reverseLocationSearch(e.lng as number, e.lat as number),
                    ),
            );
            await Promise.all(
                locations.map((l, index) => {
                    const { subname, name, osmId } = l;
                    const sighting = elements[index];
                    if (name) sighting.location = name;
                    if (subname) sighting.subname = subname;
                    if (osmId) sighting.osmId = osmId;
                    return sighting.save();
                }),
            );
        }
    }
};
