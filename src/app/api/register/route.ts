import bcrypt from 'bcrypt';
import {NextRequest,NextResponse} from 'next/server';
import User from '@/models/userModel';
import { connect } from "@/dbconfig/dbconfig";

export async function POST(request : NextRequest) {

    try {
        const reqBody = await request.json();
        const {email,name,password} = reqBody;
        if(!email || !name || !password){
            return NextResponse.json({error:"All fields are required"},{status:400});
        }

        await connect();

        const user = await User.findOne({email})
        if(user) {
            return NextResponse.json({error:'User already exists'},{status:400})
        }


        const hashedPassword = await bcrypt.hash(password,12);
        const newuser = await User.create({
            email,
            name,
            password:hashedPassword
        });

        return NextResponse.json({message:'User created',data:newuser},{status:200})
        
    } catch (error : any) {
        console.log('REGISTRATION_ERROR',error)
        return NextResponse.json({error:error.message},{status:500})
    }
    
}