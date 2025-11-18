import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { FurnitureLibrary } from "@/components/FurnitureLibrary";
import { UploadZone } from "@/components/UploadZone";
import { DecorCanvas } from "@/components/DecorCanvas";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { Toolbar } from "@/components/Toolbar";
import ChatIntegrado from "@/components/ChatIntegrado";
import { apiRequest } from "@/lib/queryClient";
import type { Furniture, CanvasFurnitureItem, Project } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [canvasItems, setCanvasItems] = useState<CanvasFurnitureItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasFurnitureItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { data: furniture = [], isLoading } = useQuery<Furniture[]>({
    queryKey: ["/api/furniture"],
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { roomImageUrl: string; furnitureItems: CanvasFurnitureItem[] }) => {
      return await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      toast({
        title: "Projeto guardado",
        description: "O seu design foi guardado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível guardar o projeto.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { imageUrl } = await response.json();

      setRoomImage(imageUrl);
      setCanvasItems([]);
      setHistory([[]]);
      setHistoryIndex(0);
      
      toast({
        title: "Imagem carregada",
        description: "Pode agora começar a decorar o seu espaço!",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  }, [toast]);

  const handleAddFurniture = useCallback(
    (furnitureItem: Furniture) => {
      if (!roomImage) return;

      const newItem: CanvasFurnitureItem = {
        furnitureId: `instance-${Date.now()}`,
        catalogId: furnitureItem.id,
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        rotation: 0,
        zIndex: canvasItems.length,
      };

      const newItems = [...canvasItems, newItem];
      setCanvasItems(newItems);
      setSelectedItemId(newItem.furnitureId);
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newItems);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      toast({
        title: "Móvel adicionado",
        description: `${furnitureItem.name} foi adicionado ao canvas.`,
      });
    },
    [roomImage, canvasItems, history, historyIndex, toast]
  );

  const handleUpdateItems = useCallback((newItems: CanvasFurnitureItem[], addToHistory: boolean = true) => {
    setCanvasItems(newItems);
    if (addToHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newItems);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleUpdateSelectedItem = useCallback(
    (updates: Partial<CanvasFurnitureItem>) => {
      if (!selectedItemId) return;

      const newItems = canvasItems.map((item) =>
        item.furnitureId === selectedItemId ? { ...item, ...updates } : item
      );
      handleUpdateItems(newItems);
    },
    [selectedItemId, canvasItems, handleUpdateItems]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasItems(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasItems(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(() => {
    if (!roomImage) {
      toast({
        title: "Erro",
        description: "Nenhuma imagem carregada.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      roomImageUrl: roomImage,
      furnitureItems: canvasItems,
    });
  }, [roomImage, canvasItems, saveMutation, toast]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || !roomImage) {
      toast({
        title: "Erro",
        description: "Nenhuma imagem para descarregar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvasElement = canvasRef.current.querySelector('[data-testid="canvas-workspace"]');
      if (!canvasElement) return;

      const canvas = await html2canvas(canvasElement as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `decorar-design-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Download concluído",
          description: "A sua imagem foi transferida com sucesso!",
        });
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a imagem.",
        variant: "destructive",
      });
    }
  }, [canvasRef, roomImage, toast]);

  const handleUploadClick = useCallback(() => {
    document.getElementById("file-input")?.click();
  }, []);

  const handleDeleteSelectedItem = useCallback(() => {
    if (!selectedItemId) return;
    
    const newItems = canvasItems.filter((item) => item.furnitureId !== selectedItemId);
    handleUpdateItems(newItems, true);
    setSelectedItemId(null);
    
    toast({
      title: "Item eliminado",
      description: "O móvel foi removido do canvas.",
    });
  }, [selectedItemId, canvasItems, handleUpdateItems, toast]);

  const handleDuplicateSelectedItem = useCallback(() => {
    if (!selectedItemId) return;
    
    const item = canvasItems.find((i) => i.furnitureId === selectedItemId);
    if (!item) return;
    
    const newItem: CanvasFurnitureItem = {
      ...item,
      furnitureId: `instance-${Date.now()}`,
      x: item.x + 20,
      y: item.y + 20,
      zIndex: Math.max(...canvasItems.map((i) => i.zIndex), 0) + 1,
    };
    
    const newItems = [...canvasItems, newItem];
    handleUpdateItems(newItems, true);
    setSelectedItemId(newItem.furnitureId);
    
    toast({
      title: "Item duplicado",
      description: "O móvel foi duplicado com sucesso.",
    });
  }, [selectedItemId, canvasItems, handleUpdateItems, toast]);

  const selectedItem = canvasItems.find(
    (item) => item.furnitureId === selectedItemId
  );

  if (isLoading || isUploadingImage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            {isUploadingImage ? "A processar imagem..." : "A carregar móveis..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar
        onUpload={handleUploadClick}
        onSave={handleSave}
        onDownload={handleDownload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasImage={!!roomImage}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobília no lado ESQUERDO - LARGURA AUMENTADA */}
        <div className="w-[320px] border-r bg-background">
          <FurnitureLibrary
            furniture={furniture}
            onAddFurniture={handleAddFurniture}
          />
        </div>

        {/* ÁREA DE DIVISÃO (CANVAS) - MAIOR ESPAÇO */}
        <div className="flex-[3] overflow-auto bg-gray-50 dark:bg-gray-900" ref={canvasRef}>
          {roomImage ? (
            <DecorCanvas
              roomImage={roomImage}
              furniture={furniture}
              canvasItems={canvasItems}
              onUpdateItems={handleUpdateItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
            />
          ) : (
            <UploadZone onImageUpload={handleImageUpload} />
          )}
        </div>

        {/* PROPRIEDADES SEMPRE VISÍVEIS - LARGURA AUMENTADA */}
        <div className="w-[300px] border-l bg-background flex flex-col">
          <PropertiesPanel
            selectedItem={selectedItem ?? null}
            onUpdateItem={handleUpdateSelectedItem}
            onDeleteItem={handleDeleteSelectedItem}
            onDuplicateItem={handleDuplicateSelectedItem}
          />
          <div className="p-4 border-t flex-1 overflow-hidden">
            <ChatIntegrado
              furniture={furniture}
              canvasItems={canvasItems}
              onAddFurniture={handleAddFurniture}
              onUpdateItems={handleUpdateItems}
            />
          </div>
        </div>
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
        className="hidden"
      />
    </div>
  );
}
