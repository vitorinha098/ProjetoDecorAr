import React from "react";

interface Props {
  onSelect: (item: string) => void;
}

const items = ["Sofá", "Mesa", "Cadeira", "Lâmpada", "Planta"];

export default function FurnitureLibrary({ onSelect }: Props) {
  return (
    <div>
      <h2 className="font-bold text-lg mb-2 text-gray-700">Móveis</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="w-full text-left p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
