import mongoose,{Types,Schema} from 'mongoose';

export type ConversationType = {
    _id: Types.ObjectId,
    createdAt: Date,
    lastMessageAt: Date,
    name: string,
    isGroup: boolean,
    messagesIds: Types.ObjectId[],
    userIds: Types.ObjectId,
}

const conversationSchema = new Schema<ConversationType>({
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
},{timestamps:true},);

const Conversation =  mongoose.models.conversations || mongoose.model('Conversation', conversationSchema);

export default Conversation;
