import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username/Email", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.username || !credentials?.password) {
        throw new Error("Missing credentials");
      }

      await connectToDatabase();

      const user = await User.findOne({
        $or: [{ username: credentials.username }, { email: credentials.username }],
      });

      if (!user) {
        throw new Error("No user found with those credentials");
      }

      if (!user.password) {
        throw new Error("Please log in with the provider you used to sign up.");
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      return { id: user._id.toString(), name: user.username, email: user.email };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // They don't have a password because they signed in with Google
          await User.create({
            email: user.email,
            username: user.name?.replace(/\s+/g, "").toLowerCase() || `user_${Date.now()}`,
            image: user.image,
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-development-key",
};
