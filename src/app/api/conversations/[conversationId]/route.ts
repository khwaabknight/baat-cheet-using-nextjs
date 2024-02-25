import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import { connect } from "@/dbconfig/dbconfig";
import Conversation from "@/models/conversationModel";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
    conversationId ?: string;
}

export async function DELETE(
    request:NextRequest,
    {params} : {params:IParams}
) {
    try {
        await connect();

        const {conversationId} = params;
        const currentUser = await getCurrentUser();

        if(!currentUser?.id) {
            return NextResponse.json({data:'Unauthorized'},{status:401});
        }

        const existingConversation = await Conversation.findById(conversationId).populate('users').exec();

        if(!existingConversation) {
            return NextResponse.json({data:'Invalid ID'},{status:400});
        }
        
        const deletedConversation = await Conversation.deleteMany({_id:conversationId,users:currentUser._id});

        existingConversation.users.forEach((user) => {
            if(user.email) {
                pusherServer.trigger(user.email,'delete-conversation',existingConversation);
            }
        })

        return NextResponse.json({data:deletedConversation},{status:200});

    } catch (error:any) {
        console.log("ERROR_CONVERSATION_DELETE",error);
        return NextResponse.json({error:error.message},{status:500})        
    }

}