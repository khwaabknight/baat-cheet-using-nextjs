import User from "@/models/userModel";
import getSession from "./getSession";
import { connect } from "@/dbconfig/dbconfig";
const getUsers = async () => {
    await connect()
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