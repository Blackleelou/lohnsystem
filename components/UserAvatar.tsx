// components/UserAvatar.tsx
import { useState, useRef, useEffect } from 'react';

interface Props {
  username: string | null;
  email: string;
}

export default function UserAvatar({ username, email }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initial = (username || email || 'U')[0]?.toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '40px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        title={username || email}
      >
        {initial}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '120px',
            zIndex: 1000,
          }}
        >
          <a
            href="/dashboard"
            style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}
          >
            Einstellungen
          </a>
          <a
            href="/api/auth/signout?callbackUrl=/"
            style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
