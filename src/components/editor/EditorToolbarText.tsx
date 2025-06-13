export default function EditorToolbarText() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <select className="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm">
        {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
          <option key={size}>{size}px</option>
        ))}
      </select>

      <input
        type="color"
        className="w-8 h-8 rounded border border-gray-300"
        title="Schriftfarbe"
      />

      <button className="w-8 h-8 rounded border border-gray-300 font-bold hover:bg-gray-100">
        B
      </button>

      <button className="w-8 h-8 rounded border border-gray-300 italic hover:bg-gray-100">
        I
      </button>

      <select className="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm">
        <option>Links</option>
        <option>Zentriert</option>
        <option>Rechts</option>
      </select>
    </div>
  );
}
