import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}

export default function IndexRedirect() {
  return null;
}
