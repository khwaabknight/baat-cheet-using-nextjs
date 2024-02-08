import { ConversationType } from "@/models/conversationModel";
import { UserType } from "@/models/userModel";
import { MessageType } from "@/models/messageModel";

export type FullMessageType = MessageType & {
    sender: UserType;
    seenBy: UserType[];
}

export type FullConversationType = ConversationType & {
    users: UserType[];
    messages: FullMessageType[];
}