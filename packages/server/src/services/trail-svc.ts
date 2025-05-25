import { Schema, model } from "mongoose";
import { Trail } from "../models/trail";

const TrailSchema = new Schema<Trail>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String
  },
  { collection: "geomem_trails" }
);

const TrailModel = model<Trail>("Trail", TrailSchema);

function index(): Promise<Trail[]> {
  return TrailModel.find();
}

async function get(id: string): Promise<Trail> {
  const trail = await TrailModel.findById(id);
  if (!trail) throw `${id} Not Found`;
  return trail;
}

function create(data: Trail): Promise<Trail> {
  const t = new TrailModel(data);
  return t.save();
}
async function update(id: string, data: Trail): Promise<Trail> {
  const updated = await TrailModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw `${id} not updated`;
  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await TrailModel.findByIdAndDelete(id);
  if (!deleted) throw `${id} not deleted`;
}

export default { index, get, create, update, remove };