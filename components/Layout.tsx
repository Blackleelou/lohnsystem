import React from "react";
import UserMenu from "./UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
        <UserMenu />
      </div>
      <main>{children}</main>
    </div>
  );
}