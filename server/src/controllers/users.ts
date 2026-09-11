//Controller for users in src/controllers/users.ts

import type { Request, Response } from 'express';
import User from '../models/user.js'

export const getUsers = async (req: Request, res: Response) => {
  // Logic to get users from the database
  const users = await User.find({});
  res.send(users);
}

export const getUserById = async (req: Request, res: Response) => {
  // Logic to get a user by ID from the database
  const user = await User.findById(req.params.id);
  if (!user) {
    throw Object.assign(new Error("User ID not found."), {
      statusCode: 404,
    });
  }
  res.send(user);
}

export const getCurrentUser = async (req: Request, res: Response) => {
  // Logic to fetch the currently logged in user
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw Object.assign(new Error("No se encontró ningún usuario con ese id"), {
      statusCode: 404,
    });
  }
  res.send(user);
};

export const createUser = async (req: Request, res: Response) => {
  // Create a new user (with the 3 props)
  const { name, about, avatar } = req.body;
  const user = await User.create({ name, about, avatar });
  res.send(user);
};

export const updateProfile = async (req: Request, res: Response) => {
  // Profile handler 
  const { name, about } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw Object.assign(new Error("No se encontró ningún usuario con ese id"), { statusCode: 404 });
  }
  res.send(user);
};

export const updateAvatar = async (req: Request, res: Response) => {
  // Change your avatar
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw Object.assign(new Error("No se encontró ningún usuario con ese id"), { statusCode: 404 });
  }
  res.send(user);
};