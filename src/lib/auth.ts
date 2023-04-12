import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

// Function to retrieve Google API credentials from environment variables
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("MISSING GOOGLE_CLIENT_SECRET");
  }
  return { clientId, clientSecret };
}

// Define the NextAuth options for authentication (authOptions has type NextAuthOptions)
export const authOptions: NextAuthOptions = {
  // An adapter in NextAuth.js is a module that allows you to customize the way sessions and user data are stored.
  // By default, NextAuth.js uses an in-memory database to store session and user data.
  // However, in production, you'd typically want to use a more reliable and persistent storage solution like a database.
  // The UpstashRedisAdapter is an adapter that enables NextAuth.js to store session data in a Redis database.
  // It provides the necessary functions to interact with the Redis database for storing, retrieving, and updating session and user data.
  adapter: UpstashRedisAdapter(db),

  // Configure session handling to use JSON Web Tokens (JWT) as the strategy
  session: {
    strategy: "jwt",
  },

  // Customize the default NextAuth pages, in this case, the signIn page
  pages: {
    signIn: "/login",
  },

  // Configure providers for authentication, in this case, Google
  providers: [
    GoogleProvider({
      // Use the clientId and clientSecret obtained from the `getGoogleCredentials()` function
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],

  // Callbacks in the context of NextAuth.js are functions that are executed during specific events in the authentication process
  // They allow you to customize and control different aspects of the authentication and session management
  callbacks: {
    // The 'jwt' callback is called when a JWT token is created or updated.
    // It allows you to customize the content of the JWT token.
    async jwt({ token, user }) {
      if (user) {
        // This is a new sign-in or the user is being updated
        token.id = user.id;
        return token;
      }

      // If there's no user object and the token already has an id, this means
      // the token represents an existing user
      if (token.id) {
        const dbUser = (await db.get(`user: ${token.id}`)) as User | null;

        if (dbUser) {
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
          };
        }
      }

      // If no user object and the token doesn't have an id, return the token unchanged
      return token;
    },

    // The 'session' callback is called when a session is created or updated.
    // It allows you to customize the session object.
    async session({ session, token }) {
      // If the 'token' object exists (i.e., the user is authenticated)
      if (token) {
        // Update the session's user information with the data from the 'token' object.
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string | undefined;
      }
      // Return the updated session object.
      return session;
    },

    // The 'redirect' callback is called whenever a user is redirected during the
    // authentication process. It allows you to customize the redirection URL.
    redirect() {
      // In this case, the user is redirected to the '/dashboard' URL after authentication.
      return "/dashboard";
    },
  },
};
