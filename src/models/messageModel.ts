import mongoose,{Types,Schema} from 'mongoose';
export type MessageType = {
    _id: Types.ObjectId,
    body: string,
    image: string,
    createdAt: Date,
    seenIds: Types.ObjectId[],
    conversationId: Types.ObjectId,
    senderId: Types.ObjectId,
}

const messageSchema = new Schema<MessageType>({
    body: {
        type: String,
    },
    image: {
        type: String,
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
},{timestamps: true});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
