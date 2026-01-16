import { NextResponse } from "next/server";
import {connectToDB} from "../../../lib/db";
import Video from "../../../models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import IVideo from "../../../models/Video";
import { NextRequest } from "next/server";


export async function GET() {
  
    try {
        
        await connectToDB();
      const videos = await Video.find({}).sort({ createdAt: -1 }).lean();


        if(!videos || videos.length === 0){
          return NextResponse.json([],  {status: 404});
        }

        return NextResponse.json(videos, {status: 200});

    } catch (error) {
         return NextResponse.json(
             {error: "Failed to fetch videos" },
             {status: 500}
         );
    }
    // Your application logic to authenticate the user
}

export async function POST(request: NextRequest) {
  try {
   const session = await getServerSession(authOptions);
   if(!session){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});

   }
   await connectToDB();

   await body: IVideo  = await req.json();
    
  } catch (error) {
    
  }
}