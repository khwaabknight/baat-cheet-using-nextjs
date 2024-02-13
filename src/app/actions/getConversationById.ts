import Conversation from "@/models/conversationModel";
import getCurrentUser from "./getCurrentUser";
import {connect} from "@/dbconfig/dbconfig"

const getConversationById = async ( conversationId: string) => {
    try {
        await connect();

        const currentUser = await getCurrentUser();
        if(!currentUser?.email){
            console.log('no user in get conversation')
            return null;
        }



        const conversation = await Conversation.findById(conversationId).populate('users').exec();


        return conversation;        
    } catch (error:any) {
        console.log("get current Conversation by Id error",error)
        return null;        
    }

}

export default getConversationById;