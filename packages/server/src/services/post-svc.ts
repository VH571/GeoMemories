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
function create(data: Post): Promise<Post> {
  const p = new PostModel(data);
  return p.save();
}

async function update(id: string, data: Post): Promise<Post> {
  const updated = await PostModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw `${id} not updated`;
  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await PostModel.findByIdAndDelete(id);
  if (!deleted) throw `${id} not deleted`;
}

export default { index, get, create, update, remove };
