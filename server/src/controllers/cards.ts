//Controller for cards in src/controllers/cards.ts

import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/card.js'

export const getCards = async (req: Request, res: Response) => {
  // Logic to get cards from the database
  const cards = await Card.find({});
  const userId = req.user?._id;

  const cardsWithIsLiked = cards.map((card) => ({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  }));

  res.send(cardsWithIsLiked);
}

export const createCard = async (req: Request, res: Response) => {
  // Logic to create a new card in the database
  const { name, link } = req.body;
  const userId = req.user?._id;

  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw Object.assign(new Error('Invalid user ID'), {
      statusCode: 401,
    });
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

export const deleteCard = async (req: Request, res: Response) => {
  // Delete any card
  const card = await Card.findByIdAndDelete(req.params.id);
  if (!card) {
    throw Object.assign(new Error("No se encontró ninguna tarjeta con ese id"), {
      statusCode: 404,
    });
  }
  res.send({ message: "Tarjeta eliminada con éxito" });
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