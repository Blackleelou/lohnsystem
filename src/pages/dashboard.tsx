// src/pages/dashboard.tsx

import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/common/Layout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Users, User, Link2 } from "lucide-react";
import { useRouter } from "next/router";
import FAQ from "@/components/dashboard/FAQ";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // User abfragen (nur das eine Flag)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { hasChosenMode: true }
  });

  // Wenn Flag gesetzt: immer auf Lohnübersicht weiterleiten!
  if (user?.hasChosenMode) {
    return { redirect: { destination: "/lohn", permanent: false } };
  }

  // Sonst wie gewohnt:
  return { props: {} };
};
