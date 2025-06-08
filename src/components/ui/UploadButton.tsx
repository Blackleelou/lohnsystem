import { useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

type UploadButtonProps = {
  onFileSelect: (file: File) => void;
  uploading: boolean;
};

export default function UploadButton({ onFileSelect, uploading }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded transition"
      >
        <CloudArrowUpIcon className="w-5 h-5" />
        {uploading ? 'Hochladen...' : 'Datei auswählen'}
      </button>
    </div>
  );
}
