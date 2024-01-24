import bcrypt from 'bcrypt';
import NextAuth,{AuthOptions} from "next-auth";
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
    // pages: {
    //   signIn: "/login",
    //   newUser: "/my/dashboard",
    //   error: "/login",
    // },
    // callbacks: {
    //   // We can pass in additional information from the user document MongoDB returns
    //   async jwt({ token, user }: any) {
    //     if (user) {
    //       token.user = {
    //         _id: user._id,
    //         email: user.email,
    //         name: user.name,
    //       };
    //     }
    //     return token;
    //   },
      // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
      // session: async ({ session, token }: any) => {
      //   if (token) {
      //     session.user = token.user;
      //   }
      //   return session;
      // },
    // },
};
  


const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}