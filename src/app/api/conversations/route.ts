import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextRequest, NextResponse } from 'next/server';
import Conversation from '@/models/conversationModel';
import { connect } from '@/dbconfig/dbconfig';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(request: NextRequest) {
  try {

    await connect()
    const currentUser = await getCurrentUser();
    const reqBody = await request.json();

    const {userId,isGroup,members,name} = reqBody;

    if(!currentUser?.id || !currentUser?.email){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if(isGroup && (!members || members.length < 2 || !name)){
        return NextResponse.json({ error: 'Group must have members' }, { status: 400 })
    }

    
    
    if(isGroup){
        const users = members.map((member : any) => member.value); // have to change later
        console.log(users)

        users.push(currentUser._id);

        const newConversation = await Conversation.create({
            name,
            isGroup : true,
            users,
        })
        const newConversationPopulated = await Conversation.populate(newConversation,{path:'users'});

        newConversationPopulated.users.forEach((user) => {
            if(user.email) {
                pusherServer.trigger(user.email, 'new-conversation', newConversationPopulated);
            }
        })
        return NextResponse.json({data:newConversationPopulated},{status:200})
    }
    const users = [userId,currentUser._id];
    const existingConversation = await Conversation.findOne({
        users: { $all: users },
        isGroup: false,
    }).populate('users').exec();

    if(existingConversation){
        return NextResponse.json({data:existingConversation},{status:200})
    }   

    const newConversation = await Conversation.create({
        isGroup: false,
        users,
    })
    const newConversationPopulated = await Conversation.populate(newConversation,{path:'users'});

    newConversationPopulated.users.map((user) => {
        if(user.email) {
            pusherServer.trigger(user.email, 'new-conversation', newConversationPopulated);
        }
    })

    return NextResponse.json({data:newConversationPopulated},{status:200})

    
  } catch (error : any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}