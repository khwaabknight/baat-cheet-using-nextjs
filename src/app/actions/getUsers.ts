import User from "@/models/userModel";
import mongoClientPromise from "../libs/mongoClientPromise";
import getSession from "./getSession";

const getUsers = async () => {
    const session = await getSession();

    if(!session?.user?.email) return [];

    try {
        const users = await User.find({
            email : {$ne : session.user.email}
        }).sort({ createdAt: -1 });

        return users;
        
    } catch (error:any) {
        return [];
    }
}

export default getUsers;