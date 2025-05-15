import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 100 }}>
      <h2>Login</h2>
      {/* Dein Login-Formular */}
    </div>
  );
}

LoginPage.getLayout = (page: React.ReactNode) => page;