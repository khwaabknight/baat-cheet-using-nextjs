import { useSession } from "next-auth/react";
import {useMemo} from 'react';
import { FullConversationType } from "../types";
import { UserType } from "@/models/userModel";

const useOtherUser = (conversation: FullConversationType | {users:UserType[]}) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUsers = conversation.users.filter((user) => user.email !== currentUserEmail);

        return otherUsers[0];
    }, [conversation.users, session?.data?.user?.email]);

    return otherUser;

}

export default useOtherUser