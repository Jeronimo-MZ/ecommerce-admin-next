import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRepository } from "../../../../../server/repositories/user-repository";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = Number(token.sub);
      return session;
    },
  },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "mail@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req): Promise<any> => {
        const userRepository = new UserRepository();
        const user = await userRepository.findOne({ email: credentials?.email as string });
        if (!user) return null;
        const passwordMatches = await compare(credentials?.password as string, user.password);
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
