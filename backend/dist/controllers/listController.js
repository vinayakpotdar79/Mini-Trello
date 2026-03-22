import List from '../models/List';
export const getLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({ boardId }).sort('position');
        res.status(200).json({
            success: true,
            data: lists
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const createList = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;
        const lists = await List.find({ boardId });
        const position = lists.length;
        const list = await List.create({
            title,
            boardId: boardId,
            position,
        });
        res.status(201).json({
            success: true,
            data: list
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedList = await List.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        res.status(200).json({
            success: true,
            data: updatedList
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        await List.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data: id
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
