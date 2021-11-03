export interface IGooglePlace {
    place: google.maps.places.PlaceResult;
    formattedAddress: string;
    city?: string;
    country?: string;
    state?: string;
    zipCode?: string;
}
