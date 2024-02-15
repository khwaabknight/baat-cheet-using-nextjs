import mongoose,{Types,Schema} from 'mongoose';
import { MessageType } from './messageModel';
import { UserType } from './userModel';

export type ConversationType = {
    _id: Types.ObjectId,
    createdAt: Date,
    lastMessageAt: Date,
    name: string,
    isGroup: boolean,
    messages: Types.ObjectId[] | MessageType[],
    users: UserType[] | Types.ObjectId[],
}

const conversationSchema = new Schema<ConversationType>({
    lastMessageAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
    },
    isGroup: {
        type: Boolean,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],
    users : [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true,"Please provide user id"],
            ref: 'User',
        }
    ]
},{timestamps:true},);

const Conversation =  mongoose.models.Conversation || mongoose.model<ConversationType>('Conversation', conversationSchema);

export default Conversation;
