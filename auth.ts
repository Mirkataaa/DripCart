import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NEXTAUTH_SECRET } from "./lib/contants";

export const config = {
    trustHost: true,

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // Data coming from a form
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if the user exist and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correnct , return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match , return null
        return null;
      },
    }),
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user Id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name

      // If there is an update , set the user name

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user filend to token
      if (user) {
        token.id = user.id; 
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update db to feflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if(trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if(sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId},
            });

            if(sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: {userId: user.id},
              });

              // Assign new cart
              await prisma.cart.update({
                where: {id: sessionCart.id},
                data: {userId: user.id}
              })
            }
          }
        }
      }
      return token;
    },
    authorized({request , auth } : any) {

      // Array of regex patterns of paths we want to protect

      const protectedPaths = [
        /\/shipping-address/, 
        /\/payment-method/, 
        /\/profile/, 
        /\/user\/(.*)/, 
        /\/order\/(.*)/, 
        /\/admin/, 
      ];

      // Get pathname from the request URL object

      const {pathname} = request.nextUrl;

      // Check if user is not auth and accessing a protected path
      if(!auth && protectedPaths.some((p) => p.test(pathname))) {        
        return false;        
      }

      // Check for seesion cart cookie
      if(!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        });

        // Set newly generated sessonCardId in the reponse cookies
        response.cookies.set('sessionCartId' , sessionCartId);

        return response;
      } else {
        return true;  
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
