import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    seenIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide conversation id"],
        ref: 'Conversation',
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide sender id"],
        ref: 'User',
    },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
