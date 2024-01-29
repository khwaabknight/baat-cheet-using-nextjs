import mongoose,{Types,Schema} from "mongoose";

export type AccountType = {
    _id: Types.ObjectId,
    userId : Types.ObjectId,
    accountType : string,
    provider: string,
    providerAccountId: string,
    refreshToken: string,
    accessToken: string,
    expiresAt: number,
    tokenType: string,
    scope: string,
    idToken: string,
    sessionState: string,
}

const accountSchema = new Schema<AccountType>({
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
        type: Number,
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