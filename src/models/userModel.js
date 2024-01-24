import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
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
})

// const User = mongoose.models.users || mongoose.model('users',userSchema);
const User = mongoose.models.User || mongoose.model('User',userSchema);
 // You can use 'User' also instead of 'users'

export default User;