import { Request, Response } from 'express';
import Card from '../models/Card';
import { ApiResponse } from '../types/apiResponse';

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const cards = await Card.find({ listId }).sort('position');
    res.status(200).json({
      success: true,
      data: cards
    } as ApiResponse<typeof cards>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
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

    res.status(201).json({
      success: true,
      data: card
    } as ApiResponse<typeof card>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const updateCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    res.status(200).json({
      success: true,
      data: updatedCard
    } as ApiResponse<typeof updatedCard>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};


export const deleteCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      data: id
    } as ApiResponse<string>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};