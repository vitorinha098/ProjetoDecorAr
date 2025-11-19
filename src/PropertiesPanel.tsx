import React from "react";

interface Props {
  selected: string | null;
}

export default function PropertiesPanel({ selected }: Props) {
  if (!selected) {
    return (
      <div className="text-gray-500 text-center mt-10">
        Seleciona um móvel para editar 🛋️
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-2 text-gray-700">Propriedades</h2>
      <p className="mb-2 text-gray-600">
        Estás a editar: <b>{selected}</b>
      </p>

      <label className="block mt-2">Posição X:</label>
      <input type="range" min="0" max="100" className="w-full" />

      <label className="block mt-2">Posição Y:</label>
      <input type="range" min="0" max="100" className="w-full" />

      <label className="block mt-2">Tamanho:</label>
      <input type="range" min="0" max="200" className="w-full" />
    </div>
  );
}
