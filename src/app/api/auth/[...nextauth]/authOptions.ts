import bcrypt from 'bcrypt';
import {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoClientPromise from "@/app/libs/mongoClientPromise";
import { connect } from "@/dbconfig/dbconfig";
import User from '@/models/userModel';

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(mongoClientPromise),
    
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
      // ...add more providers here
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: {label: "email", type: "email",placeholder: "email@example.com"},
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          
          try {
            await connect();
            const user = await User.findOne({ email: credentials.email });

            if(!user || !user.password){ // either user doesnot exists || user logged in with social login
              throw new Error("Invalid credentials");
            }

            const isCorrectPasssword : boolean = await bcrypt.compare(credentials.password, user.password);
            if(!isCorrectPasssword){
              throw new Error("Invalid credentials");
            }

            return user;
          } catch (err: any) {
            throw new Error(err);
          }
        },
      }),
    ],
    debug: process.env.NODE_ENV === "development",
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET!,
};