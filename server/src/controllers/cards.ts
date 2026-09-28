//Controller for cards in src/controllers/cards.ts

import type { Request, Response, NextFunction } from 'express';
import { Types, Document } from 'mongoose';
import Card from '../models/card.js'

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return next(Object.assign(new Error("A valid user ID is required"), {
        statusCode: 401,
      }));
    }
    const cards = await Card.find({ owner: userId }).sort({ createdAt: -1 });

    // Casteamos 'card' a (Document & { ... }) para que TypeScript sepa
    // con certeza que el método toObject() existe en este contexto.
const cardsWithIsLiked = cards.map((card: Document & { likes: Types.ObjectId[] }) => ({
  ...card.toObject(),
  isLiked: card.likes.some((id: Types.ObjectId) => id.toString() === userId),
}));

    res.send(cardsWithIsLiked);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  // Logic to create a new card in the database
  const { name, link } = req.body;
  const userId = req.user?._id;

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return next(Object.assign(new Error('Invalid user ID'), {
      statusCode: 401,
    }));
  }

  const card = await Card.create({
    name,
    link,
    owner: new Types.ObjectId(userId),
  });

  res.send({
    ...card.toObject(),
    isLiked: false
  });
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  // delete any card, but only if the user is the owner of that card
  try {
    const cardId = req.params.id;
    const userId = req.user?._id;

    // 1. Buscamos la tarjeta
    const card = await Card.findById(cardId);

    // Si no existe, lanzamos el error 404
    if (!card) {
      return next(Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
        statusCode: 404,
      }));
    }

    // 2. Comprobamos la propiedad
    // card.owner es un ObjectId, userId (req.user._id) viene del token JWT
    if (card.owner.toString() !== userId) {
      return next(Object.assign(new Error("No tienes autorización para borrar esta tarjeta"), {
        statusCode: 403,
      }));
    }

    // 3. Si todo está bien, la borramos
    await Card.findByIdAndDelete(cardId);

    res.send({ message: "Tarjeta eliminada con éxito" });

  } catch (error: unknown) {
    // Manejo de IDs mal formados
    if (error instanceof Error && error.name === 'CastError') {
      return next(Object.assign(new Error('ID de tarjeta inválido'), { statusCode: 400 }));
    }
    next(error);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  // Get those likes up
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  );
  // Slight fallback just in case an error pops up when liking a deleted card that hasn't updated
  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), { statusCode: 404 });
  }

  const userId = req.user?._id;
  res.send({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  });
};

export const unlikeCard = async (req: Request, res: Response) => {
  // Remove the like from the card
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user?._id } },
    { new: true }
  );

  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), { statusCode: 404 });
  }

  const userId = req.user?._id;
  res.send({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  });
};