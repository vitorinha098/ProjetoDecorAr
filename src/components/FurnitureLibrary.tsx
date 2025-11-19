import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Furniture } from "@shared/schema";

const categories = [
  { id: "all", label: "Todos" },
  { id: "bed", label: "Camas" },
  { id: "desk", label: "Secretárias" },
  { id: "lamp", label: "Lâmpadas" },
  { id: "vase", label: "Jarros" },
  { id: "basket", label: "Cestos" },
  { id: "mirror", label: "Espelhos" },
  { id: "plant", label: "Plantas" },
  { id: "wardrobe", label: "Roupeiros" },
];

interface FurnitureLibraryProps {
  furniture: Furniture[];
  onAddFurniture: (furniture: Furniture) => void;
}

export function FurnitureLibrary({ furniture, onAddFurniture }: FurnitureLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFurniture = furniture.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 space-y-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold font-serif text-sidebar-foreground">
          Biblioteca de Móveis
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar móveis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
            data-testid="input-search-furniture"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="h-8 rounded-full px-4"
              data-testid={`button-category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-2 gap-4">
          {filteredFurniture.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => onAddFurniture(item)}
              data-testid={`card-furniture-${item.id}`}
            >
              <div className="aspect-square bg-background relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                    data-testid={`button-add-${item.id}`}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <p className="text-base font-medium truncate" data-testid={`text-furniture-name-${item.id}`}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.style}
                  </Badge>
                  {item.price && (
                    <span className="text-sm text-muted-foreground">
                      {item.price}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
