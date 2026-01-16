import mongoose from "mongoose"; 
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}

let cached  = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};


}

export async function connectToDB(){
    if(cached.conn){
        return cached.conn;
    }   

    if(!cached.promise){
        const opts = {
            bufferCommands: true, //no more buffering
            maxPoolSize: 10, //for multiple connections
        }
        mongoose
        .connect(MONGODB_URI,)
        .then(() => mongoose.connection)

    }
    try{
        cached.conn = await cached.promise;
    }
    catch(err){
        cached.promise = null;
        throw err;
    }
    return cached.conn;
}