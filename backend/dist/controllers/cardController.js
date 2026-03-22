import Card from '../models/Card';
export const getCards = async (req, res) => {
    try {
        const { listId } = req.params;
        const cards = await Card.find({ listId }).sort('position');
        res.status(200).json({
            success: true,
            data: cards
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const createCard = async (req, res) => {
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
            listId: listId,
            position,
        });
        res.status(201).json({
            success: true,
            data: card
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCard = await Card.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        res.status(200).json({
            success: true,
            data: updatedCard
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        await Card.findByIdAndDelete(id);
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
export const reorderCards = async (req, res) => {
    try {
        const { listId } = req.params;
        const { cardIds } = req.body;
        // Update positions for each card
        const updatePromises = cardIds.map((cardId, index) => Card.findByIdAndUpdate(cardId, { position: index }));
        await Promise.all(updatePromises);
        res.status(200).json({
            success: true,
            message: 'Cards reordered successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
