import { model, Schema } from "mongoose";

const contactSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  contactType: {
    type: String,
    enum: ["work", "personal", "home"],
    default: "personal",
  },
  isFavourite: { type: Boolean, default: false },
  userId: { type: String, required: true },
});

export const Contact = model("contact", contactSchema);
