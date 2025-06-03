// components/dashboard/DashboardCard.tsx

import React from "react";

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
  buttonText: string;
  color?: string;
  onClick?: () => void;
}

export default function DashboardCard({
  icon,
  title,
  text,
  buttonText,
  color,
  onClick,
}: DashboardCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-100 dark:border-gray-800 cursor-pointer transition hover:shadow-2xl">
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{text}</p>
      <button
        className={`px-4 py-2 rounded font-semibold ${color || "bg-blue-500 text-white"}`}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}
