import React, { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';

const UserMenu: React.FC = () => {
  if (typeof window === 'undefined') return null;
  const sessionData = useSession();
  const session = sessionData?.data;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || '?';

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#444',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {userInitial}
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: 4,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          minWidth: 120,
          padding: 8,
        }}>
          <button
            onClick={() => signOut()}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;