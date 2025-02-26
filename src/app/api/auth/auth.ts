import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import UserModels from "@/models/User.models";
import { connectDb } from "../lib/mongodb";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb();
        const user = await UserModels.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");
        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
