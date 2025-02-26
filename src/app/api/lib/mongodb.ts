import mongoose from "mongoose"

const MONGO_URL = process.env.MONGO_URL || " ";

if(!MONGO_URL) throw new Error("database not found env incorrect!!!");

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDb() {
    if(cached.conn) return cached.conn

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGO_URL, {}).then((mongoose) => mongoose)
    }

    cached.conn = await cached.promise
    return cached.conn
}