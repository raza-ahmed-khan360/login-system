import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { client } from '@/sanity/lib/client';
import jwt from 'jsonwebtoken';

// Extend the built-in types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      provider?: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    provider?: string;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email,public_profile',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      try {
        // Check if user exists in Sanity
        const existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: user.email }
        );

        if (!existingUser) {
          // Create new user in Sanity
          await client.create({
            _type: 'user',
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider,
            createdAt: new Date().toISOString(),
          });
        }

        // Generate JWT token for API authentication
        const authToken = jwt.sign(
          { 
            userId: existingUser?._id || user.id,
            email: user.email 
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Set the auth token cookie
        const cookieResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/set-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: authToken }),
        });

        if (!cookieResponse.ok) {
          console.error('Failed to set auth token cookie');
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      // Always redirect to home page after successful authentication
      return `${baseUrl}/`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

export { handler as GET, handler as POST }; 