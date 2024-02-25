'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { UserType } from "@/models/userModel";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";

type ConversationListProps = {
  initialItems : FullConversationType[];
  users: UserType[];
}

const ConversationList : React.FC<ConversationListProps> = ({initialItems,users}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const {conversationId, isOpen} = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  },[session.data?.user?.email]);

  useEffect(() => {
    if(!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const findFirst = (arr:FullConversationType[],message:FullConversationType) =>(arr.filter((item) => item._id === message._id)[0])

    const newConvHandler = (conversation:FullConversationType) => {
      setItems((current) => {
        if(findFirst(current,conversation)) {
          return current;
        }

        return [conversation,...current];
      })
    }

    const updateHandler = (conversation:FullConversationType) => {
      setItems((current) => current.map((currConv) => {
        if(currConv._id === conversation._id) {
          return {
            ...currConv,
            messages: conversation.messages,
          }
        }
        return currConv;
      }))
    }

    const removeHandler = (conversation:FullConversationType) => {
      setItems((current) => {
        return [...current.filter((conv) => conv._id !== conversation._id)];
      })

      if(conversationId === conversation._id.toString()) {
        router.push("/conversations");
      }
    }

    pusherClient.bind('new-conversation', newConvHandler);
    pusherClient.bind('update-conversation', updateHandler);
    pusherClient.bind('delete-conversation', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('new-conversation', newConvHandler);
      pusherClient.unbind('update-conversation', updateHandler);
      pusherClient.unbind('delete-conversation', removeHandler);
    }
  },[pusherKey,conversationId,router]);


  return (
    <>
      <GroupChatModal
        users = {users}
        isOpen={isModalOpen}
        onClose = {() => setIsModalOpen(false)}
      />
      <aside 
      className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`
      ,isOpen ? "hidden":"block w-full left-0")}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className=" text-2xl font-bold text-neutral-800">
              Messages
            </div>

            <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition" onClick={() => setIsModalOpen(true)}>
              <MdOutlineGroupAdd size={20}/>
            </div>
          </div>
          {
            items.map((item) => (
              <ConversationBox
                key={item._id.toString()}
                data={item}
                selected={conversationId === item._id.toString()}
              />
            ))
          }
        
        </div>
      </aside>
    </>
  )
}

export default ConversationList