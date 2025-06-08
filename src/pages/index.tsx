// Datei: pages/index.tsx

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    redirect: {
      destination: session ? '/dashboard' : '/login',
      permanent: false,
    },
  };
}

// Kein sichtbarer Inhalt, da nur Weiterleitung erfolgt
export default function IndexRedirect() {
  return null;
}
