import express from 'express';
import { getLists, createList, updateList, deleteList, } from '../controllers/listController';
import { protect } from '../middleware/authMiddleware';
const router = express.Router({ mergeParams: true });
router.get('/', protect, getLists);
router.post('/', protect, createList);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);
export default router;
