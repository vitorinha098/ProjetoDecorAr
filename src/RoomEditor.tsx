import React, { useState } from "react";
import FurnitureLibrary from "./FurnitureLibrary";
import PropertiesPanel from "./PropertiesPanel";

interface Props {
  username: string;
  onLogout: () => void;
}

export default function RoomEditor({ username, onLogout }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      {/* Biblioteca de móveis */}
      <div className="w-1/5 bg-white border-r overflow-y-auto p-4">
        <FurnitureLibrary onSelect={setSelected} />
      </div>

      {/* Área da divisão */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center relative">
        <div className="w-[80%] h-[80%] bg-white shadow-xl border relative flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Aqui aparece a tua divisão 📸</p>
        </div>
      </div>

      {/* Painel de propriedades */}
      <div className="w-1/4 bg-white border-l p-4">
        <PropertiesPanel selected={selected} />
      </div>
    </div>
  );
}
