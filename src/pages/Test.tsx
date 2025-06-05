// pages/test-whatsapp.tsx

import QRCode from "react-qr-code";
import { Mail } from "lucide-react";

export default function TestWhatsApp() {
  const handleWhatsApp = () => {
    window.location.href = `https://wa.me/?text=Test`;
  };

  return (
    <div className="flex flex-col items-center p-10 space-y-10">
      <h1 className="text-2xl font-bold">Test: WhatsApp-Icon</h1>
      <div className="flex gap-8">
        <span
          onClick={handleWhatsApp}
          className="cursor-pointer hover:opacity-80"
          title="WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-12 h-12 text-green-500"
            fill="currentColor"
          >
            <path d="M380.9 97.1C339.3 55.6 283.9 32 …" />
          </svg>
        </span>
        <span
          onClick={() => alert("Mail")}
          className="cursor-pointer hover:opacity-80"
          title="E-Mail"
        >
          <Mail className="w-12 h-12 text-blue-500" />
        </span>
      </div>
    </div>
  );
}
