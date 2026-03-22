import express from "express";
import { generateInviteLink, joinBoard, getInviteInfo } from "../controllers/joinBoardController";
import { protect } from '../middleware/authMiddleware';
const router = express.Router();
router.post('/generate-invite-link/:boardId', protect, generateInviteLink);
router.post('/join', protect, joinBoard);
router.get('/invite-info/:token', protect, getInviteInfo);
export default router;
