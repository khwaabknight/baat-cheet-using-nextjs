
import mongoose,{Types,Schema} from 'mongoose'

export type UserType = {
    _id: Types.ObjectId,
    name: string,
    email: string,
    emailVerified: Date,
    image: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    conversationIds: Types.ObjectId[],
    seenMessageIds: Types.ObjectId[],
    accounts: Types.ObjectId[],
    messages: Types.ObjectId[],
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
    conversationIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        }
    ],

    seenMessageIds: [
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
},{timestamps:true},)

// const User = mongoose.models.users || mongoose.model('users',userSchema);
const User = mongoose.models.User || mongoose.model('User',userSchema);
 // You can use 'User' also instead of 'users'

export default User;