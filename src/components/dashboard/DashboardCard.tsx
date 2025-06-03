import React from "react";

export default function DashboardCard({
  icon,
  title,
  text,
  buttonText,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  buttonText: string;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-100 dark:border-gray-800 transition-all hover:shadow-2xl`}
    >
      <div className={`mb-3 ${color}`}>{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-4">{text}</p>
      <button
        className="btn-primary px-6 py-2 rounded-lg"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}
