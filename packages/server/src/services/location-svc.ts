import { Schema, model } from "mongoose";
import { Location } from "../models/location.js";

const LocationSchema = new Schema<Location>(
  {
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    description: String,
  },
  { collection: "geomem_locations" }
);

LocationSchema.index(
  { name: 1, "coordinates.lat": 1, "coordinates.lng": 1 },
  { unique: true }
);

const LocationModel = model<Location>("Location", LocationSchema);

function index(): Promise<Location[]> {
  return LocationModel.find();
}

async function get(id: string): Promise<Location> {
  const location = await LocationModel.findById(id);
  if (!location) throw new Error(`${id} not found`);
  return location;
}

async function create(data: Location): Promise<Location> {
  const existing = await LocationModel.findOne({
    name: new RegExp(`^${data.name}$`, "i"),
  });

  if (existing) {
    throw new Error("A location with this name already exists.");
  }

  const loc = new LocationModel(data);
  return loc.save();
}

async function update(id: string, data: Location): Promise<Location> {
  const updated = await LocationModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updated) throw new Error(`${id} not updated`);
  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await LocationModel.findByIdAndDelete(id);
  if (!deleted) throw new Error(`${id} not deleted`);
}

export default { index, get, create, update, remove };
