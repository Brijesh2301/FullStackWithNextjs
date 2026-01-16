import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../models/User";
import { connectToDB } from "./db";
import bcrypt from "bcryptjs";
import { POST } from '../app/api/auth/register/route';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your own logic here
    
        if // (credentials?.email || credentials?.password){
            (!credentials || !credentials.email || !credentials.password) {
            throw new Error("Incredentialsvalid email or password");
 
        
        }
        try {
            await connectToDB()
           const user = await User.findOne({email: credentials.email})
           if(!user){
            throw new Error("No user find with this email");
           }

          const isValid =  await bcrypt.compare( credentials.password, user.password)
            if(!isValid){
                throw new Error("Invalid password");
            }

            return {
                id: user._id.toString(),
                email: user.email,
            }
        } catch (error) {
            console.error("Authorize error:", error);
            throw error;
        }
        return null;
      },
    }),

  ],
  callbacks:{
    async jwt({token, user}){
        if(user){
            token.id = user.id;
        }
        return token;
    },
    async session({session, token}){
        if(session.user){
        
            session.user.id = token.id as string;
        }
        return session;
    },
  },
  pages:{
    signIn: "/login",
    error: "/login",
  },
  session:{
    strategy: "jwt",
    maxAge: 30 * 60 * 60, // 30 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};
