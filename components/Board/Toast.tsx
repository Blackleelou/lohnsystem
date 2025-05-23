import React, { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyle = "fixed top-4 right-4 px-4 py-2 rounded shadow z-50 text-sm";
  const typeStyle =
    type === "success"
      ? "bg-green-100 border border-green-300 text-green-800"
      : "bg-red-100 border border-red-300 text-red-800";

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      {message}
    </div>
  );
}
