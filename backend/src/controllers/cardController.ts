import { Request, Response } from 'express';
import Card from '../models/Card';

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const cards = await Card.find({ listId }).sort('position');
    res.status(200).json(cards);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;

    const cards = await Card.find({ listId });
    const position = cards.length;

    const card = await Card.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      listId: listId as string,
      position,
    });

    res.status(201).json(card);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedCard);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.status(200).json({ id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};