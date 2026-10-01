//Controller for users in src/controllers/users.ts

import type { Request, Response } from 'express';
import User from '../models/user.js'
import bcrypt from 'bcryptjs';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Card from '../models/card.js'

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    // Map the array to only include the fields we want to expose
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    }));

    res.send(formattedUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const user = await User.findById(req.params.id);

if (!user) {
      return next(Object.assign(new Error("User ID not found."), { statusCode: 404 }));
    }
    // We also hide the email when viewing someone else's profile (by mapping only the fields we want to expose)
res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });
  } catch (error: unknown) {
    // Error block for wrong ID format
    if (error instanceof Error && error.name === 'CastError') {
      return next(Object.assign(new Error('Formato de ID inválido'), { statusCode: 400 }));
    }
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(Object.assign(new Error("No se encontró ningún usuario con ese id"), { statusCode: 404 }));
    }
    // Mongoose returns the full user object, including the email, because this is the owner of the profile. Other users won't see the email.
    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(Object.assign(new Error("No se encontró ningún usuario con ese id"), { statusCode: 404 }));
    }
    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(Object.assign(new Error("No se encontró ningún usuario con ese id"), { statusCode: 404 }));
    }
    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, about, avatar } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Se requiere un correo electrónico y una contraseña" });
    }

    if (password.length < 8) {
      return res.status(400).send({ message: "La contraseña debe tener al menos 8 caracteres" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar
    });

    // Inyección de la tarjeta de bienvenida vinculada al nuevo usuario
    await Card.create({
      name: '¡Bienvenido a Around!',
      link: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
      owner: user._id,
      likes: []
    });

    res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });

  } catch (error: unknown) {
if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000) {
      return res.status(409).send({ message: "Este correo electrónico ya está registrado" });
    }
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: "ID de usuario inválido" });
    }
    next(error);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Se requiere un correo electrónico y una contraseña" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.send({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar
      }
    });

  } catch (error) {
    next(error);
  }
};