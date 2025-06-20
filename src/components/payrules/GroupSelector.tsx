// src/components/payrules/GroupSelector.tsx

interface Props {
  groups: string[];
  selected: string | null;
  onSelect: (group: string) => void;
}

export default function GroupSelector({ groups, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {groups.map((group) => (
        <button
          key={group}
          onClick={() => onSelect(group)}
          className={`
            px-3 py-1 text-sm rounded-md border
            ${selected === group
              ? 'border-blue-500 text-blue-700 bg-blue-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
          `}
          style={{ fontWeight: selected === group ? '600' : '400' }}
        >
          {group}
        </button>
      ))}
    </div>
  );
}
