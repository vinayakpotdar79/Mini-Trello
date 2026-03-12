import express from 'express';
import {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getBoards);
router.post('/', protect, createBoard);
router.get('/:id', protect, getBoardById);
router.put('/:id', protect, updateBoard);
router.delete('/:id', protect, deleteBoard);

export default router;
