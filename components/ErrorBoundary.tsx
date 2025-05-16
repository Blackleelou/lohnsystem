import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <h1>Ups! Da ist etwas schiefgelaufen.</h1>
          <p style={{ margin: '20px 0' }}>Bitte lade die Seite neu oder kontaktiere den Support.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Seite neu laden
            </button>
            <a
              href="mailto:support@lohnsystem.de"
              style={{
                padding: '10px 20px',
                backgroundColor: '#ccc',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Support kontaktieren
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;