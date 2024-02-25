'use client';
import useConversation from "@/app/hooks/useConversation";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body : React.FC<BodyProps>= ({initialMessages = []}) => {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null);

  const {conversationId} = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  },[conversationId,messages[messages.length-1]?._id]);

  useEffect(() => {
    let channel = pusherClient.subscribe(conversationId.toString());
    bottomRef.current?.scrollIntoView({behavior:"smooth"});

    const findFirst = (arr:FullMessageType[],message:FullMessageType) =>(arr.filter((item) => item._id === message._id)[0])

    const messageHandler = (message:FullMessageType) => {
      setMessages((current) => {
        if(findFirst(current,message)) {
          return current;
        }

        return [...current,message];
      });

      bottomRef.current?.scrollIntoView({behavior:"smooth"});
    }

    const updateMessageHandler = (newMessage:FullMessageType) => {
      console.log("newMessage",newMessage);
      setMessages((current) => {
        if(current.length === 0) return [newMessage];
        if(current[current.length-1]._id === newMessage._id) {
          return [...current.slice(0,-1),newMessage];
        }
        return [...current,newMessage];
      })
    }

    channel.bind('new-message', messageHandler);
    channel.bind('update-message', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind('new-message',messageHandler);
      channel.unbind('update-message', updateMessageHandler)
    }
  },[conversationId,messages]);

  return (
    <div className="flex-1 overflow-y-auto">
        {
          messages.map((message,index) => (
            <MessageBox
              isLast = {index === messages.length - 1}
              key={message._id.toString()}
              data={message}
            />
          ))
        }
        <div ref={bottomRef} className="pt-24"/>
    </div>
  )
}

export default Body