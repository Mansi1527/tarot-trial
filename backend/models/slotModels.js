import { Schema, model } from "mongoose";

const slotSchema = new Schema({
  date: String,
  time: String,
  bookedBy: { type: String, default: null }, // Email of the user who booked
});

export default model("Slot", slotSchema);
