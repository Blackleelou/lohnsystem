import React from "react";
import UserMenu from "./UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-end p-4 bg-white shadow-sm">
        <UserMenu />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
