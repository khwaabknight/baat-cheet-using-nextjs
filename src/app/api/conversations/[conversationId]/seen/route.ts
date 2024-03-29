import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import Conversation from "@/models/conversationModel";
import Message from "@/models/messageModel";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function POST(request: NextRequest,{params}: {params: IParams}) {
    try {
        const currentuser = await getCurrentUser();
        const {conversationId} = params;

        if(!currentuser?._id || !currentuser?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // Find the existing conversation
        const conversation = await Conversation.findById(conversationId).populate([{
                path:"users",
                model:"User",
            },{
                path:"messages",
                populate: {
                    path:"seenBy",
                    model:"User",
                }
            }
        ]).exec();
        
        if(!conversation){
            return NextResponse.json({error: "Invalid ID"}, {status: 404});
        }

        // Find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if(!lastMessage){
            return NextResponse.json({conversation});
        }
        // Update seen of last message
        const updatedMessage = await Message.findByIdAndUpdate(
            lastMessage._id,
            {$addToSet : {seenBy: currentuser._id}},
            {new:true}).populate("seenBy sender").exec();

        console.log("updatedMessage",updatedMessage);

        await pusherServer.trigger(currentuser.email,'update-conversation',{
            _id:conversationId,
            messages:[updatedMessage],
        });

        if(lastMessage.seenBy.indexOf(currentuser._id) !== -1){
            return NextResponse.json({conversation},{status: 200});
        }

        await pusherServer.trigger(conversationId?.toString()!,'update-message',updatedMessage);

        return NextResponse.json({updatedMessage},{status: 200});
    } catch (error:any) {
        console.log("Conversation/conversationId/seen API Error: ", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }


}