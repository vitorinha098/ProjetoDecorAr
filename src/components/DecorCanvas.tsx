import { useRef, useState, useCallback, useEffect } from "react";
import { Trash2, Copy, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Furniture, CanvasFurnitureItem } from "@shared/schema";

interface DecorCanvasProps {
  roomImage: string;
  furniture: Furniture[];
  canvasItems: CanvasFurnitureItem[];
  onUpdateItems: (items: CanvasFurnitureItem[], addToHistory?: boolean) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
}

export function DecorCanvas({
  roomImage,
  furniture,
  canvasItems,
  onUpdateItems,
  selectedItemId,
  onSelectItem,
}: DecorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startItemState, setStartItemState] = useState<CanvasFurnitureItem | null>(null);

  const selectedItem = canvasItems.find(
    (item) => item.furnitureId === selectedItemId
  );

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    onSelectItem(itemId);
    const item = canvasItems.find((i) => i.furnitureId === itemId);
    if (!item) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartItemState(item);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!startItemState || !selectedItemId) return;

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        onUpdateItems(
          canvasItems.map((item) =>
            item.furnitureId === selectedItemId
              ? { ...item, x: startItemState.x + deltaX, y: startItemState.y + deltaY }
              : item
          ), false
        );
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * Math.sign(deltaX + deltaY);

        const newWidth = Math.max(50, Math.min(500, startItemState.width + delta));
        const newHeight = Math.max(50, Math.min(500, startItemState.height + delta));

        onUpdateItems(
          canvasItems.map((item) =>
            item.furnitureId === selectedItemId
              ? { ...item, width: newWidth, height: newHeight }
              : item
          ), false
        );
      } else if (isRotating) {
        const centerX = startItemState.x + startItemState.width / 2;
        const centerY = startItemState.y + startItemState.height / 2;

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const rotation = ((angle * 180) / Math.PI + 90) % 360;

        onUpdateItems(
          canvasItems.map((i) =>
            i.furnitureId === selectedItemId ? { ...i, rotation } : i
          ), false
        );
      }
    },
    [isDragging, isResizing, isRotating, selectedItemId, dragStart, startItemState, canvasItems, onUpdateItems]
  );

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = canvasItems.find((i) => i.furnitureId === selectedItemId);
    if (!item) return;
    
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartItemState(item);
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = canvasItems.find((i) => i.furnitureId === selectedItemId);
    if (!item) return;
    
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartItemState(item);
  };

  const handleMouseUp = useCallback(() => {
    if ((isDragging || isResizing || isRotating) && startItemState && selectedItemId) {
      onUpdateItems(canvasItems, true);
    }
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setStartItemState(null);
  }, [isDragging, isResizing, isRotating, startItemState, selectedItemId, canvasItems, onUpdateItems]);

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  const handleDelete = () => {
    if (selectedItemId) {
      onUpdateItems(canvasItems.filter((item) => item.furnitureId !== selectedItemId), true);
      onSelectItem(null);
    }
  };

  const handleDuplicate = () => {
    if (selectedItemId) {
      const item = canvasItems.find((i) => i.furnitureId === selectedItemId);
      if (item) {
        const newItem: CanvasFurnitureItem = {
          ...item,
          furnitureId: `instance-${Date.now()}`,
          x: item.x + 20,
          y: item.y + 20,
          zIndex: Math.max(...canvasItems.map((i) => i.zIndex), 0) + 1,
        };
        onUpdateItems([...canvasItems, newItem], true);
        onSelectItem(newItem.furnitureId);
      }
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 bg-background overflow-auto z-0"
      onClick={(e) => { if (e.target === e.currentTarget) onSelectItem(null); }}
      data-testid="canvas-workspace"
    >
      <div className="min-h-[70vh] relative" style={{ minWidth: "100%" }}>
        <img
          src={roomImage}
          alt="Room"
          className="w-full h-auto pointer-events-none select-none"
          draggable={false}
        />

        {canvasItems.map((item) => {
          const furnitureData = furniture.find((f) => f.id === item.catalogId);
          if (!furnitureData) return null;

          const isSelected = item.furnitureId === selectedItemId;

          return (
            <div
              key={item.furnitureId}
              className={`
                absolute cursor-move transition-transform duration-200
                ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
              `}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                transform: `perspective(800px) rotateX(${(item as any).rotationX ?? 0}deg) rotateY(${(item as any).rotationY ?? 0}deg) rotate(${item.rotation}deg)`,
                zIndex: item.zIndex,
              }}
              onMouseDown={(e) => handleMouseDown(e, item.furnitureId)}
              data-testid={`canvas-item-${item.furnitureId}`}
            >
              <img
                src={furnitureData.imageUrl}
                alt={furnitureData.name}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  mixBlendMode: "multiply",
                }}
              />

              {isSelected && (
                <>
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onMouseDown={(e) => {
                        // iniciar rotação ao arrastar o botão
                        handleRotateStart(e);
                      }}
                      data-testid="button-rotate"
                      aria-label="Rodar móvel"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate();
                      }}
                      data-testid="button-duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      data-testid="button-delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div
                    className="absolute -bottom-2 -right-2 h-6 w-6 bg-primary rounded-full cursor-nwse-resize flex items-center justify-center"
                    onMouseDown={handleResizeStart}
                    data-testid="handle-resize"
                  >
                    <div className="h-2 w-2 bg-white rounded-full" />
                  </div>

                  <div
                    className="absolute -top-8 right-0 h-6 w-6 bg-primary rounded-full cursor-grab flex items-center justify-center"
                    onMouseDown={handleRotateStart}
                    data-testid="handle-rotate"
                  >
                    <div className="h-3 w-0.5 bg-white" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
