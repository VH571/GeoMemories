import { Schema, model } from "mongoose";
import { Post } from "../models/post";

const PostSchema = new Schema<Post>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["message", "picture"], required: true },
    content: { type: String, required: true },
    caption: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    trailId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "geomem_posts" }
);

const PostModel = model<Post>("Post", PostSchema);

function index(): Promise<Post[]> {
  return PostModel.find();
}

async function get(id: string): Promise<Post> {
  const post = await PostModel.findById(id);
  if (!post) throw new Error(`${id} Not Found`);
  return post;
}


export default { index, get };
