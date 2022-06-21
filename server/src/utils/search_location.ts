import axios from "axios";
import { LocationInfo, OsmSearchResult } from "../interfaces";

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
                key !== 'country_code' &&
                key !== 'postcode' &&
                key !== 'ISO3166-2-lvl6' &&
                key !== 'ISO3166-2-lvl4' &&
                key !== 'ISO3166-2-lvl3',
        )
        .slice(0, 3)
        .map(([, value]) => value)

    const name = nameItems.join(', ')
    // reduce nameItems from display_name
    const subname = nameItems.reduce((acc, item) => {
        return acc.replace(`${item}, `, '').replace(item, '')
    }, osm.display_name)

    return {
        osmId: String(osm.osm_id),
        name,
        subname,
        lat: parseFloat(osm.lat),
        lng: parseFloat(osm.lon),
    }
}

/**
 * @author @JulianWels
 * @param osm 
 * @returns 
 */
export const locationSearch = async (
    search: string,
): Promise<LocationInfo[]> => {
    console.log('locationSearch', search)
    const options = {
        method: 'POST',
        url: 'https://nominatim.openstreetmap.org/search',
        params: {
            q: search,
            format: 'json',
            limit: '5',
            addressdetails: '1',
        },
    }
    const response = await axios.request(options)

    return response.data.map(osmToLocationInfo)
}

/**
 * @author @JulianWels
 * @param osm 
 * @returns 
 */
export const reverseLocationSearch = async (
    longitude: number,
    latitude: number,
): Promise<LocationInfo> => {
    const options = {
        method: 'POST',
        url: 'https://nominatim.openstreetmap.org/reverse',
        params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
            addressdetails: '1',
        },
    }

    const response = await axios.request(options)
    return osmToLocationInfo(response.data)
}
