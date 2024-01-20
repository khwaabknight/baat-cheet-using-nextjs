import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"Please provide user id"],
        ref: 'User',
    },
    accountType : {
        type: String,
        required: [true,"Please provide account type"],
    },
    provider: {
        type: String,
        required: [true,"Please provide provider"],
    },
    providerAccountId: {
        type: String,
        required: [true,"Please provide provider account id"],
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    expiresAt: {
        type: Integer,
    },
    tokenType: {
        type: String,
    },
    scope: {
        type: String,
    },
    idToken: {
        type: String,
    },
    sessionState: {
        type: String,
    },
});


accountSchema.index({provider:1,providerAccountId:1},{unique:true});  // This is to make sure that the combination of provider and providerAccountId is unique

const Account = mongoose.models.accounts || mongoose.model('Account',accountSchema);

export default Account;