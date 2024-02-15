import mongoose,{Types,Schema} from 'mongoose';
import { UserType } from './userModel';
import { ConversationType } from './conversationModel';
export type MessageType = {
    _id: Types.ObjectId,
    body: string,
    image: string,
    createdAt: Date,
    seenBy: Types.ObjectId[]  | UserType[],
    conversation: Types.ObjectId | ConversationType,
    sender: Types.ObjectId | UserType,
}

const messageSchema = new Schema<MessageType>({
    body: {
        type: String,
    },
    image: {
        type: String,
    },
    seenBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide conversation id"],
        ref: 'Conversation',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide sender id"],
        ref: 'User',
    },
},{timestamps: true});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
