import { Request, Response } from 'express';
import List from '../models/List';
import { ApiResponse } from '../types/apiResponse';

export const getLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const lists = await List.find({ boardId }).sort('position');
    res.status(200).json({
      success: true,
      data: lists
    } as ApiResponse<typeof lists>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const createList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const lists = await List.find({ boardId });
    const position = lists.length;

    const list = await List.create({
      title,
      boardId: boardId as string,
      position,
    });

    res.status(201).json({
      success: true,
      data: list
    } as ApiResponse<typeof list>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const updateList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedList = await List.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    res.status(200).json({
      success: true,
      data: updatedList
    } as ApiResponse<typeof updatedList>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const deleteList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
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
