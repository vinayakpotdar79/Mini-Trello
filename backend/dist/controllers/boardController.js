import Board from '../models/Board';
export const getBoards = async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [{ ownerId: req.user.id }, { members: req.user.id }],
        }).populate('members', 'name email');
        res.status(200).json({
            success: true,
            data: boards
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const createBoard = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({
                success: false,
                message: 'Title is required'
            });
            return;
        }
        let board = await Board.create({
            title,
            ownerId: req.user.id,
            members: [req.user.id],
        });
        board = await board.populate('members', 'name email');
        res.status(201).json({
            success: true,
            data: board
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate('members', 'name email');
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        // Check access
        if (board.ownerId.toString() !== req.user.id && !board.members.some((m) => (m._id || m).toString() === req.user.id)) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: board
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            res.status(404).json({
                success: false,
                message: 'Board not found'
            });
            return;
        }
        if (board.ownerId.toString() !== req.user.id) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }
        const updatedBoard = await Board.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.status(200).json({
            success: true,
            data: updatedBoard
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            res.status(404).json({
                success: false,
                message: 'Board not found'
            });
            return;
        }
        if (board.ownerId.toString() !== req.user.id) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }
        await board.deleteOne();
        res.status(200).json({
            success: true,
            data: req.params.id
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
