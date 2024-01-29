import mongoClientPromise from '@/app/libs/mongoClientPromise';
import getSession from './getSession';
import User from '@/models/userModel';
import { connect } from '@/dbconfig/dbconfig';

const getCurrentUser = async () => {
    await connect();
    try {
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