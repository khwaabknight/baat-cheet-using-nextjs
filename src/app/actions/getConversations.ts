import Conversation from "@/models/conversationModel";
import getCurrentUser from "./getCurrentUser";
import {connect} from "@/dbconfig/dbconfig"

connect();
const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser?._id){
        console.log('no user in get conversation')
        return [];
    }

    try {
        // Message is not made yet
        // const conversations = await Conversation.find({users : currentUser._id}).sort({ lastMessageAt: -1 }).populate([{
        //         path:'users',
        //         model:'User',
        //     },{
        //         path:'messages',
        //         model:'Message',
        //         populate: [
        //             {
        //                 path : 'sender',
        //                 model : 'User',
        //             },
        //             {
        //                 path : 'seenBy',
        //                 model : 'User',
        //             }
        //         ]
        //     }
        // ]).exec();

        const conversations = await Conversation.find({users : currentUser._id}).populate('users').exec();
        console.log('conversation',conversations)
        return conversations;

    } catch (error:any) {
        console.log('error in get conversations',error)
        return [];
    }
}

export default getConversations;