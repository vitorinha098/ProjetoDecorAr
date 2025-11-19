import { RotateCw, Move, Maximize2, Trash2, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { CanvasFurnitureItem } from "@shared/schema";

interface PropertiesPanelProps {
  selectedItem: CanvasFurnitureItem | null;
  onUpdateItem: (updates: Partial<CanvasFurnitureItem>) => void;
  onDeleteItem?: () => void;
  onDuplicateItem?: () => void;
}

export function PropertiesPanel({ selectedItem, onUpdateItem, onDeleteItem, onDuplicateItem }: PropertiesPanelProps) {
  const hasSelection = !!selectedItem;
  
  // Função auxiliar para manipular atualizações apenas quando há seleção
  const handleUpdate = (updates: Partial<CanvasFurnitureItem>) => {
    if (hasSelection) {
      onUpdateItem(updates);
    }
  };

  return (
    <div
      className="w-[300px] bg-sidebar border-l border-sidebar-border flex flex-col relative z-10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold font-serif">Propriedades</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {!hasSelection && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">
                Selecione um item para editar propriedades
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Posição</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">X</Label>
                <div className="text-sm font-medium rounded-md px-3 py-2 bg-muted">
                  {hasSelection ? Math.round(selectedItem.x) : 0}px
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Y</Label>
                <div className="text-sm font-medium rounded-md px-3 py-2 bg-muted">
                  {hasSelection ? Math.round(selectedItem.y) : 0}px
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Tamanho</Label>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Largura</Label>
                  <span className="text-xs font-medium">
                    {hasSelection ? Math.round(selectedItem.width) : 0}px
                  </span>
                </div>
                <Slider
                  value={[hasSelection ? selectedItem.width : 0]}
                  onValueChange={([width]) => handleUpdate({ width })}
                  min={50}
                  max={500}
                  step={5}
                  className="w-full"
                  disabled={!hasSelection}
                  data-testid="slider-width"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Altura</Label>
                  <span className="text-xs font-medium">
                    {hasSelection ? Math.round(selectedItem.height) : 0}px
                  </span>
                </div>
                <Slider
                  value={[hasSelection ? selectedItem.height : 0]}
                  onValueChange={([height]) => handleUpdate({ height })}
                  min={50}
                  max={500}
                  step={5}
                  className="w-full"
                  disabled={!hasSelection}
                  data-testid="slider-height"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Rotação</Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Ângulo Z</Label>
                <span className="text-xs font-medium">
                  {hasSelection ? Math.round(selectedItem.rotation) : 0}°
                </span>
              </div>
              <Slider
                value={[hasSelection ? selectedItem.rotation : 0]}
                onValueChange={([rotation]) => handleUpdate({ rotation })}
                min={0}
                max={360}
                step={5}
                className="w-full"
                disabled={!hasSelection}
                data-testid="slider-rotation"
              />
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Ângulo X</Label>
                <span className="text-xs font-medium">
                  {hasSelection ? Math.round(selectedItem.rotationX ?? 0) : 0}°
                </span>
              </div>
              <Slider
                value={[hasSelection ? (selectedItem.rotationX ?? 0) : 0]}
                onValueChange={([rotationX]) => handleUpdate({ rotationX })}
                min={-90}
                max={90}
                step={1}
                className="w-full"
                disabled={!hasSelection}
                data-testid="slider-rotation-x"
              />
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Ângulo Y</Label>
                <span className="text-xs font-medium">
                  {hasSelection ? Math.round(selectedItem.rotationY ?? 0) : 0}°
                </span>
              </div>
              <Slider
                value={[hasSelection ? (selectedItem.rotationY ?? 0) : 0]}
                onValueChange={([rotationY]) => handleUpdate({ rotationY })}
                min={-90}
                max={90}
                step={1}
                className="w-full"
                disabled={!hasSelection}
                data-testid="slider-rotation-y"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Camada</Label>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground flex-1">Z-Index</Label>
              <span className="text-sm font-medium bg-muted rounded-md px-3 py-2">
                {hasSelection ? selectedItem.zIndex : 0}
              </span>
            </div>
          </div>

          {hasSelection && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Ações</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={onDuplicateItem}
                    disabled={!hasSelection}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={onDeleteItem}
                    disabled={!hasSelection}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
