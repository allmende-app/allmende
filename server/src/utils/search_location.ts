import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
    LocationInfo,
    MapType,
    OsmIdResponse,
    OsmSearchResult,
    OsmType,
} from "../interfaces";
import { Logger } from "../lib";

// Code copied from @JulianWels

/**
 * @author @JulianWels
 * @param osm
 * @returns
 */
export const osmToLocationInfo = (osm: OsmSearchResult): LocationInfo => {
    const nameItems = Object.entries(osm.address)
        .filter(
            ([key]) =>
                key !== "country_code" &&
                key !== "postcode" &&
                key !== "ISO3166-2-lvl6" &&
                key !== "ISO3166-2-lvl4" &&
                key !== "ISO3166-2-lvl3",
        )
        .slice(0, 3)
        .map(([, value]) => value);

    const name = nameItems.join(", ");
    // reduce nameItems from display_name
    const subname = nameItems.reduce((acc, item) => {
        return acc.replace(`${item}, `, "").replace(item, "");
    }, osm.display_name);

    return {
        osmId: String(osm.osm_id),
        name,
        subname,
        lat: parseFloat(osm.lat),
        lng: parseFloat(osm.lon),
    };
};

/**
 * @author @JulianWels
 * @param osm
 * @returns
 */
export const locationSearch = async (
    search: string,
): Promise<LocationInfo[]> => {
    Logger.info("locationSearch", search);
    const options = {
        method: "POST",
        url: "https://nominatim.openstreetmap.org/search",
        params: {
            q: search,
            format: "json",
            limit: "5",
            addressdetails: "1",
        },
    };
    const response = await axios.request(options);

    return response.data.map(osmToLocationInfo);
};

/**
 * @author @JulianWels
 * @param osm
 * @returns
 */
export const reverseLocationSearch = async (
    longitude: number,
    latitude: number,
): Promise<LocationInfo> => {
    const options: AxiosRequestConfig = {
        method: "POST",
        url: "https://nominatim.openstreetmap.org/reverse",
        params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            addressdetails: "1",
        },
        headers: {
            "user-agent": "allmende v1.0 contact info@allmende-student.de",
        },
    };

    const response = await axios.request(options);
    return osmToLocationInfo(response.data);
};

export const locationSearchById = async (id: string): Promise<LocationInfo> => {
    try {
        const types = Object.values(OsmType);

        const promises = await Promise.all(types.map(type => {
            const options: AxiosRequestConfig = {
                url: "https://nominatim.openstreetmap.org/details.php",
                params: {
                    osmtype: type,
                    osmid: id,
                    addressdetails: "1",
                    hierarchy: "0",
                    group_hierarchy: "1",
                    format: "json",
                },
                headers: {
                    "user-agent": "allmende v1.0 contact info@allmende-student.de",
                },
            };

            return new Promise<OsmIdResponse | null>((resolve) => {
                axios.request<OsmIdResponse>(options).then(d => resolve(d.data)).catch(e => resolve(null));
            });
        }));

        const fullfilled: OsmIdResponse[] = promises.filter(p => p !== null) as OsmIdResponse[];
        const r = fullfilled[0];
        if (r) {
            const { localname, address, geometry, osm_id } = r;

            const localNames: string[] = [];
            address.forEach((a) => {
                if (
                    a.place_type === MapType.CITY ||
                    a.type === MapType.COUNTRY ||
                    a.type === MapType.POSTAL_CODE
                ) {
                    localNames.push(a.localname);
                }
            });
            const subname = localNames.join(", ");
            return {
                osmId: String(osm_id),
                name: localname,
                subname,
                lat: geometry.coordinates[1],
                lng: geometry.coordinates[0],
            };
        } else {
            return {
                name: null,
                subname: null,
                lat: null,
                lng: null,
            }
        }
    } catch (err: any) {
        Logger.error(err.message);
        throw err;
    }
};
