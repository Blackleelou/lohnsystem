import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import UserMenu from "@/components/user/UserMenu";
import {
  Users,
  Settings,
  QrCode,
  KeyRound,
  Trash,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  List,
  Folder,
} from "lucide-react";

const links = [
  { href: "/team/settings", label: "Allgemein", icon: <Settings /> },
  { href: "/team/members", label: "Mitglieder", icon: <Users /> },
  { href: "/team/invites", label: "Einladungen", icon: <QrCode /> },
  { href: "/team/security", label: "Zugangs-Code", icon: <KeyRound /> },
  { href: "/team/payrules", label: "Zuschläge", icon: <BarChart2 /> },
  { href: "/team/shifts", label: "Schichten", icon: <List /> },
  { href: "/team/files", label: "Dokumente", icon: <Folder /> },
  { href: "/team/delete", label: "Team löschen", icon: <Trash />, danger: true },
];

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out 
