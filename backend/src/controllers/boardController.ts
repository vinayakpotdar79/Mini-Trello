import { Request, Response } from 'express';
import Board from '../models/Board';
import { ApiResponse } from '../types/apiResponse';

export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const boards = await Board.find({
      $or: [{ ownerId: req.user.id }, { members: req.user.id }],
    });
    res.status(200).json({
      success: true,
      data: boards
    } as ApiResponse<typeof boards>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Title is required'
      } as ApiResponse<null>);
      return;
    }
    const board = await Board.create({
      title,
      ownerId: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json({
      success: true,
      data: board
    } as ApiResponse<typeof board>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }
    // Check access
    if (board.ownerId.toString() !== req.user.id && !board.members.includes(req.user.id)) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse<null>);
      return;
    }
    res.status(200).json({
      success: true,
      data: board
    } as ApiResponse<typeof board>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found'
      } as ApiResponse<null>);
      return;
    }
    if (board.ownerId.toString() !== req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse<null>);
      return;
    }
    const updatedBoard = await Board.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.status(200).json({
      success: true,
      data: updatedBoard
    } as ApiResponse<typeof updatedBoard>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found'
      } as ApiResponse<null>);
      return;
    }
    if (board.ownerId.toString() !== req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      } as ApiResponse<null>);
      return;
    }
    await board.deleteOne();
    res.status(200).json({
      success: true,
      data: req.params.id
    } as ApiResponse<string>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    } as ApiResponse<null>);
  }
};