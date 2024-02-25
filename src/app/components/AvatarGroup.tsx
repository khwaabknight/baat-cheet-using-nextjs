'use client';

import { UserType } from "@/models/userModel";
import Image from "next/image";

interface AvatarGroupProps {
    users:UserType[];
}

const AvatarGroup:React.FC<AvatarGroupProps> = ({users = []}) => {

    const slicedUsers = users.slice(0,3)

    const positionMap = {
        0:'top-1 left-3',
        1:'bottom-0',
        2:'bottom-0 right-0'
    }
  return (
    <div className="relative h-11 w-11">
        {
            slicedUsers.map((user,index) => {                
                return(
                <div key={user._id.toString()} className={`absolute inline-block rounded-full overflow-hidden h-5 w-5 bg-black z-50 ${positionMap[index as keyof typeof positionMap]}`}>
                    <Image 
                        src={user?.image || '/images/placeholder.jpg'}
                        alt="avatar"
                        fill
                    />
                </div>
            )})
        }

    </div>
  )
}

export default AvatarGroup