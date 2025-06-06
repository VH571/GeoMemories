export interface Post {
  _id?: string;
  userId: string;
  type: "message" | "picture";
  content: string;
  caption?: string;
  locationId?: string;
  createdAt?: Date;
}
