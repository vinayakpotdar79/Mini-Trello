import { v4 as uuidv4 } from "uuid";
import Board from "../models/Board";
export const generateInviteLink = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user.id;
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404).json({ message: "Board not found" });
        return;
    }
    if (!board.ownerId.equals(userId)) {
        res.status(403).json({ message: "Not owner" });
        return;
    }
    const token = uuidv4();
    board.inviteToken = token;
    await board.save();
    res.json({
        link: `${process.env.CLIENT_URL}/join/${token}`
    });
};
export const getInviteInfo = async (req, res) => {
    const { token } = req.params;
    try {
        const board = await Board.findOne({ inviteToken: token }).populate('ownerId', 'name');
        if (!board) {
            res.status(404).json({ message: "Invalid or expired invite link" });
            return;
        }
        res.json({
            title: board.title,
            ownerName: board.ownerId.name
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export const joinBoard = async (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;
    const board = await Board.findOne({ inviteToken: token });
    if (!board) {
        res.status(404).json({ message: "Invalid Link" });
        return;
    }
    if (!board.members.includes(userId)) {
        board.members.push(userId);
        await board.save();
    }
    res.json({
        message: "Joined Successfully",
        boardId: board._id
    });
};
