import { Schema, model } from "mongoose";
import { Post } from "../models/post.js";

const PostSchema = new Schema<Post>(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    picture: { type: String },
    caption: { type: String, required: true },
    locationId: { type: String, required: true },
    createdAt: { type: Date, required: true }
  },
  { collection: "geomem_posts" }
);

const PostModel = model<Post>("Post", PostSchema);

function index(): Promise<Post[]> {
  return PostModel.find();
}

async function get(id: string): Promise<Post> {
  const post = await PostModel.findById(id);
  if (!post) throw new Error(`${id} not found`);
  return post;
}
function create(data: Post): Promise<Post> {
  const post = new PostModel(data);
  return post.save();
}

async function update(id: string, data: Post): Promise<Post> {
  const updated = await PostModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error(`${id} not updated`);
  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await PostModel.findByIdAndDelete(id);
  if (!deleted) throw new Error(`${id} not deleted`);
}

export default { index, get, create, update, remove };
