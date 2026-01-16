import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "../../../../lib/db";

import User from "../../../../models/User";


export async function POST(req: NextRequest) {
    try{
        const {email, password} = await req.json();
      
        if(!email || !password){
            return NextResponse.json({eroor: "Email and Password are required"}, {status: 400});
        }
    

  await connectToDB()

  const existingUser = await User.findOne({ email });

    if(existingUser){
        return NextResponse.json({eroor: "User is already registered"}, {status: 400});
    }

    await User.create({email, password});

    return NextResponse.json({message: "User registered successfully"}, {status: 201});
    

}
    catch(error){
        console.error("Error registering user:", error);
        return NextResponse.json({error: "Failed to register user"}, {status: 400});
    
    }
}