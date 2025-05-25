export interface Post {
  _id?: string;
  userId: string;
  type: "message" | "picture";
  content: string; // text OR image URL
  caption?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  trailId?: string;
  createdAt?: Date;
}
