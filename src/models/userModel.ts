
import mongoose,{Types,Schema} from 'mongoose'
import { ConversationType } from './conversationModel';
import { MessageType } from './messageModel';
import { AccountType } from './accountModel';

export type UserType = {
    _id: Types.ObjectId,
    name: string,
    email: string,
    emailVerified: Date,
    image: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    conversations: Types.ObjectId[] | ConversationType[],
    seenMessages: Types.ObjectId[] | MessageType[],
    accounts: Types.ObjectId[] | AccountType[],
    messages: Types.ObjectId[] | MessageType[],
}

const userSchema = new Schema<UserType>({
    name: {
        type:String,
    },
    email: {
        type:String,
        unique: true,
    },
    emailVerified: {
        type:Date,
    },
    image: {
        type:String,
    },
    password: {
        type:String,
    },
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        }
    ],

    seenMessages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],

    accounts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        }
    ],
    messages : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    }
})

userSchema.pre('save',function(next){
    this.updatedAt = new Date();
    if(!this.createdAt){
        this.createdAt = new Date();
    }
    next();
})

// const User = mongoose.models.users || mongoose.model('users',userSchema);
const User = mongoose.models.User || mongoose.model<UserType>('User',userSchema);
 // You can use 'User' also instead of 'users'

export default User;