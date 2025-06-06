export interface Location {
  _id?: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
}
