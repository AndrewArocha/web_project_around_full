import mongoose from "mongoose";

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?%#[\]@!$&'()*+,;=]+$/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Nuevo Usuario",
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    default: "Acerca de mi",
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: "El formato del enlace del avatar es inválido",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Evita que el hash viaje al cliente por error
  },
});

export default mongoose.model("User", userSchema);