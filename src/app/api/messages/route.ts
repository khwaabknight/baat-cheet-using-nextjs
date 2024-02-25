import getCurrentUser from "@/app/actions/getCurrentUser";
import { connect } from "@/dbconfig/dbconfig";
import Conversation from "@/models/conversationModel";
import Message from "@/models/messageModel";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request:NextRequest) {
    try {
        await connect();
        const currentUser = await getCurrentUser();
        const reqBody = await request.json();
        const {message,image,conversationId} = reqBody;

        if(!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const newMessage = await Message.create({
            body:message,
            image:image,
            conversation:conversationId,
            sender:currentUser.id,
            seenBy:[currentUser.id],
        });
        const newMessagePopulated = await Message.populate(newMessage,{path:"sender seenBy"});
        console.log("newMessagePopulated",newMessagePopulated);
        console.log("newMessagePopulated id type",newMessagePopulated._id);

        const updatedConversation = await Conversation.findByIdAndUpdate(conversationId,{
            lastMessageAt:new Date(),
            $push : {
                messages : newMessagePopulated._id
            }
        },{new:true}).populate([
            {
                path:'users',
                model:'User',
            },
            {
                path:'messages',
                model:'Message',
                populate: [
                    {
                        path : 'seenBy',
                        model : 'User',
                    }
                ]
            }
        ]).exec();

        await pusherServer.trigger(conversationId, 'new-message', newMessagePopulated);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email, 'update-conversation', {
                _id: conversationId,
                messages: [lastMessage],
            })
        });

        

        
        return NextResponse.json({message:newMessagePopulated,conversation:updatedConversation});
    } catch (error : any) {
        console.log("Messages API Error: ", error);    
        return NextResponse.json({error: error.message}, {status: 500});
    }
    
}