import express from 'express';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from '../controllers/cardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

router.get('/', getCards);
router.post('/', protect, createCard)
router.put('/:id', protect, updateCard)
router.delete('/:id', protect, deleteCard)
router.put('/reorder', protect, reorderCards);

export default router;