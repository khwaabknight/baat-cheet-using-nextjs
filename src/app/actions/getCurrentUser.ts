import getSession from './getSession';
import User from '@/models/userModel';
import { connect } from '@/dbconfig/dbconfig';


const getCurrentUser = async () => {
    try {
        await connect();
        const session = await getSession();
        
        if(!session?.user?.email) return null;

        const currentuser = await User.findOne({ email: session.user.email as string });

        if(!currentuser) return null;

        return currentuser;

    } catch (error) {
        return null;
    }
}

export default getCurrentUser;