//Controller for cards in src/controllers/cards.ts

import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
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
    const cardsWithIsLiked = cards.map((card: any) => ({
      ...card.toObject(),
      isLiked: card.likes.some((id: any) => id.toString() === userId),
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

  } catch (error: any) {
    // Manejo de IDs mal formados
    if (error.name === 'CastError') {
      return next(Object.assign(new Error('ID de tarjeta inválido'), { statusCode: 400 }));
    }
    next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    // 1. Buscamos la tarjeta primero
    const card = await Card.findById(req.params.id);

    // Si no existe, 404
    if (!card) {
      return next(Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), { statusCode: 404 }));
    }

    // 2. Comprobamos la propiedad (Requisito estricto del revisor)
    if (card.owner.toString() !== userId) {
      return next(Object.assign(new Error("No tienes autorización para modificar esta tarjeta"), { statusCode: 403 }));
    }

    // 3. Actualizamos añadiendo el like
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (updatedCard) {
      res.send({
        ...updatedCard.toObject(),
        isLiked: updatedCard.likes.some((id) => id.toString() === userId),
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(Object.assign(new Error('ID de tarjeta inválido'), { statusCode: 400 }));
    }
    next(error);
  }
};

export const unlikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    // 1. Buscamos la tarjeta primero
    const card = await Card.findById(req.params.id);

    // Si no existe, 404
    if (!card) {
      return next(Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), { statusCode: 404 }));
    }

    // 2. Comprobamos la propiedad (Requisito estricto del revisor)
    if (card.owner.toString() !== userId) {
      return next(Object.assign(new Error("No tienes autorización para modificar esta tarjeta"), { statusCode: 403 }));
    }

    // 3. Actualizamos quitando el like
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (updatedCard) {
      res.send({
        ...updatedCard.toObject(),
        isLiked: updatedCard.likes.some((id) => id.toString() === userId),
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(Object.assign(new Error('ID de tarjeta inválido'), { statusCode: 400 }));
    }
    next(error);
  }
};