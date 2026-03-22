import mongoose from 'mongoose';
const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    position: { type: Number, required: true },
}, {
    timestamps: true,
});
export default mongoose.model('Card', cardSchema);
