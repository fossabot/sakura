/* eslint-disable no-param-reassign */
import { createHash } from "crypto";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../services/prisma";

export default NextAuth({
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.groupId = Number(user.type);
      }

      return token;
    },
    session: ({ token, session }) => {
      if (token) {
        session.user.id = token.id;
        session.user.groupId = token.groupId;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Account Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const account = await prisma.accounts.findFirst({
          where: {
            name: { equals: credentials.name },
          },
        });

        if (!account) {
          return null;
        }

        const hashedPassword = createHash("sha1").update(credentials.password).digest("hex");

        if (account.password !== hashedPassword) {
          return null;
        }

        return account;
      },
    }),
  ],
});
