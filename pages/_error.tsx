function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px' }}>Fehler {statusCode || 'Unbekannt'}</h1>
      <p style={{ fontSize: '18px', maxWidth: 400, textAlign: 'center' }}>
        Da ist wohl etwas schiefgelaufen. Bitte versuche es erneut oder kontaktiere den Support.
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default ErrorPage;