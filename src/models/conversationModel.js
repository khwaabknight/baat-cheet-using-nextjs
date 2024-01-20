import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: [true,"Please provide created at"],
        default: Date.now,
    },
    lastMessageAt: {
        type: Date,
        required: [true,"Please provide last message at"],
    },
    name: {
        type: String,
    },
    isGroup: {
        type: Boolean,
    },

    messagesIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],

    userIds : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide user id"],
        ref: 'User',
    },
});

const Conversation =  mongoose.models.conversations || mongoose.model('Conversation', conversationSchema);

export default Conversation;
