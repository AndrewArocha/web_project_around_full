// Card Schema
import mongoose from "mongoose";

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?%#[\]@!$&'()*+,;=]+$/i;

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: "El formato del enlace de la imagen es inválido",
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Card", cardSchema);