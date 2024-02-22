import Message from "@/models/messageModel";


const getMessages = async(conversationId: string) => {
    try {
        const messages = await Message.find({conversation:conversationId}).sort({createdAt:1}).populate('sender seenBy').exec();

        return messages;
        
    } catch (error:any) {
        console.log("error in get messages", error);
        return [];
    }

}

export default getMessages;