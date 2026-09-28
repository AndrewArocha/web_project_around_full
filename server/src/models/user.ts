import mongoose from "mongoose";

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?%#[\]@!$&'()*+,;=]+$/i;

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    default: "Jacques Cousteau", 
    minlength: 2, 
    maxlength: 30 
  },
  about: { 
    type: String, 
    default: "Explorador", 
    minlength: 2, 
    maxlength: 30 
  },
  avatar: {
    type: String,
    default: "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
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