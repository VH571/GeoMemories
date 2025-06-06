export interface Post {
  _id?: string;
  userId: string;
  content: string;
  picture?: string
  caption: string;
  locationId: string;
  createdAt: Date; 
}
