'use client';

import { ConversationType } from "@/models/conversationModel";

interface ConversationListProps {
    initialItems: ConversationType[];
}

const ConversationList : React.FC<ConversationListProps> = ({initialItems}) => {
  return (
    <div>
        Conversation List!
    </div>
  )
}

export default ConversationList