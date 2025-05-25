import { Schema, model } from "mongoose";
import { Trail } from "../models/trail";

const TrailSchema = new Schema<Trail>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
  },
  { collection: "geomem_trails" }
);

const TrailModel = model<Trail>("Trail", TrailSchema);

function index(): Promise<Trail[]> {
  return TrailModel.find();
}

async function get(id: string): Promise<Trail> {
  const trail = await TrailModel.findById(id);
  if (!trail) throw new Error(`${id} Not Found`);
  return trail;
}


export default { index, get };
