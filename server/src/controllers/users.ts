//Controller for users in src/controllers/users.ts

import type { Request, Response } from 'express';
import User from '../models/user.js'
import bcrypt from 'bcryptjs';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We hide the '-email'
    const users = await User.find({}).select('-email');
    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We also hide the email when viewing someone else's profile
    const user = await User.findById(req.params.id).select('-email');
    if (!user) {
      return next(Object.assign(new Error("User ID not found."), { statusCode: 404 }));
    }
    res.send(user);
  } catch (error: any) {
    if (error.name === 'CastError') {
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

    res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar
    });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send({ message: "El correo electrónico ya está registrado" });
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