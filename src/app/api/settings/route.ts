import getCurrentUser from "@/app/actions/getCurrentUser";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {

        const currentUser = await getCurrentUser();
        const reqBody = await request.json();
        const {name,image} = reqBody;

        if(!currentUser?._id) {
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            {image:image,name:name},
            {new:true});
        
            return NextResponse.json({data:updatedUser});
    } catch (error : any) {
        console.log("ERROR_SETTINGS " , error);
        return NextResponse.json({error:error.message, message:"Internal Server error"},{status:500})
        
    }
}