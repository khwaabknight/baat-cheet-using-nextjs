'use client';
import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import {UserType} from "@/models/userModel";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
    data: UserType;
}

const UserBox:React.FC<UserBoxProps> = ({data}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(() => {
        setLoading(true);
        axios.post('/api/conversations',{
            userId : data._id
        }).then((data) => {
            router.push(`/conversations/${data.data.data._id}`)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })

    },[data,router]);


  return (
    <>
        {loading && <LoadingModal />}
        <div 
            onClick={handleClick}
            className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
        >
            <Avatar user={data} />
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div 
                        className="flex justify-between items-center mb-1"
                    >
                        <p className="text-sm  font-medium text-gray-900">
                            {data.name}
                        </p>
                    </div>

                </div>

            </div>
            

        </div>
    </>
  )
}

export default UserBox