interface ModeCardProps {
  title: string;
  description: string;
  color?: "blue" | "green";
  onClick?: () => void;
}

export default function ModeCard({ title, description, color = "blue", onClick }: ModeCardProps) {
  const borderHover = color === "blue" ? "hover:border-blue-500" : "hover:border-green-500";
  const textColor = color === "blue" ? "text-blue-700" : "text-green-700";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition ${borderHover}`}
    >
      <h2 className={`text-lg font-medium ${textColor}`}>{title}</h2>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </div>
  );
}
