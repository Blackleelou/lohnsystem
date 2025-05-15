
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const cookieSet = document.cookie.includes("userId=");
    if (cookieSet) {
      router.push("/dashboard");
    }
  }, []);

  return null;
}
